import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    """API для управления форумом: пользователи, посты, друзья, сообщения"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        path = event.get('queryStringParameters', {}).get('action', '')
        user_id = event.get('headers', {}).get('X-User-Id', '1')
        
        if method == 'GET':
            if path == 'users':
                cur.execute("""
                    SELECT u.id, u.username, u.display_name, u.avatar_url, u.bio, 
                           u.level, u.reputation, u.posts_count, u.join_date, u.is_online,
                           (SELECT COUNT(*) FROM friendships WHERE user_id = u.id) as friends_count,
                           (SELECT json_agg(badge_icon) FROM user_badges WHERE user_id = u.id) as badges
                    FROM users u
                    ORDER BY u.reputation DESC
                """)
                users = []
                for row in cur.fetchall():
                    users.append({
                        'id': row[0],
                        'username': row[1],
                        'name': row[2],
                        'avatar': row[3],
                        'bio': row[4],
                        'level': row[5],
                        'reputation': row[6],
                        'posts': row[7],
                        'joinDate': row[8].strftime('%B %Y') if row[8] else '',
                        'online': row[9],
                        'friends': row[10] or 0,
                        'badges': row[11] or []
                    })
                
                return success_response({'users': users})
            
            elif path == 'user':
                cur.execute("""
                    SELECT u.id, u.username, u.display_name, u.avatar_url, u.bio, 
                           u.level, u.reputation, u.posts_count, u.join_date, u.is_online,
                           (SELECT COUNT(*) FROM friendships WHERE user_id = u.id) as friends_count,
                           (SELECT json_agg(badge_icon) FROM user_badges WHERE user_id = u.id) as badges
                    FROM users u
                    WHERE u.id = %s
                """, (user_id,))
                
                row = cur.fetchone()
                if row:
                    user = {
                        'id': row[0],
                        'username': row[1],
                        'name': row[2],
                        'avatar': row[3],
                        'bio': row[4],
                        'level': row[5],
                        'reputation': row[6],
                        'posts': row[7],
                        'joinDate': row[8].strftime('%B %Y') if row[8] else '',
                        'online': row[9],
                        'friends': row[10] or 0,
                        'badges': row[11] or []
                    }
                    return success_response({'user': user})
                return error_response('User not found', 404)
            
            elif path == 'threads':
                category = event.get('queryStringParameters', {}).get('category')
                query = """
                    SELECT t.id, t.title, t.content, t.category, t.is_pinned,
                           t.views_count, t.likes_count, t.replies_count, 
                           t.created_at, t.updated_at,
                           u.username, u.display_name, u.avatar_url
                    FROM threads t
                    JOIN users u ON t.author_id = u.id
                """
                if category:
                    query += " WHERE t.category = %s"
                    query += " ORDER BY t.is_pinned DESC, t.created_at DESC"
                    cur.execute(query, (category,))
                else:
                    query += " ORDER BY t.is_pinned DESC, t.created_at DESC"
                    cur.execute(query)
                
                threads = []
                for row in cur.fetchall():
                    threads.append({
                        'id': row[0],
                        'title': row[1],
                        'content': row[2],
                        'category': row[3],
                        'pinned': row[4],
                        'views': row[5],
                        'likes': row[6],
                        'replies': row[7],
                        'createdAt': row[8].isoformat() if row[8] else '',
                        'updatedAt': row[9].isoformat() if row[9] else '',
                        'author': row[10],
                        'authorName': row[11],
                        'authorAvatar': row[12]
                    })
                
                return success_response({'threads': threads})
            
            elif path == 'comments':
                thread_id = event.get('queryStringParameters', {}).get('threadId')
                cur.execute("""
                    SELECT c.id, c.content, c.likes_count, c.created_at,
                           u.username, u.display_name, u.avatar_url
                    FROM comments c
                    JOIN users u ON c.author_id = u.id
                    WHERE c.thread_id = %s
                    ORDER BY c.created_at ASC
                """, (thread_id,))
                
                comments = []
                for row in cur.fetchall():
                    comments.append({
                        'id': row[0],
                        'content': row[1],
                        'likes': row[2],
                        'createdAt': row[3].isoformat() if row[3] else '',
                        'author': row[4],
                        'authorName': row[5],
                        'authorAvatar': row[6]
                    })
                
                return success_response({'comments': comments})
            
            elif path == 'friends':
                cur.execute("""
                    SELECT u.id, u.username, u.display_name, u.avatar_url, 
                           u.level, u.is_online
                    FROM users u
                    JOIN friendships f ON u.id = f.friend_id
                    WHERE f.user_id = %s
                    ORDER BY u.is_online DESC, u.display_name ASC
                """, (user_id,))
                
                friends = []
                for row in cur.fetchall():
                    friends.append({
                        'id': row[0],
                        'username': row[1],
                        'name': row[2],
                        'avatar': row[3],
                        'level': row[4],
                        'online': row[5]
                    })
                
                return success_response({'friends': friends})
            
            elif path == 'messages':
                friend_id = event.get('queryStringParameters', {}).get('friendId')
                cur.execute("""
                    SELECT m.id, m.content, m.is_read, m.created_at,
                           m.sender_id, s.username, s.display_name, s.avatar_url
                    FROM messages m
                    JOIN users s ON m.sender_id = s.id
                    WHERE (m.sender_id = %s AND m.receiver_id = %s)
                       OR (m.sender_id = %s AND m.receiver_id = %s)
                    ORDER BY m.created_at ASC
                """, (user_id, friend_id, friend_id, user_id))
                
                messages = []
                for row in cur.fetchall():
                    messages.append({
                        'id': row[0],
                        'content': row[1],
                        'isRead': row[2],
                        'createdAt': row[3].isoformat() if row[3] else '',
                        'senderId': row[4],
                        'senderUsername': row[5],
                        'senderName': row[6],
                        'senderAvatar': row[7]
                    })
                
                cur.execute("""
                    UPDATE messages SET is_read = true
                    WHERE receiver_id = %s AND sender_id = %s AND is_read = false
                """, (user_id, friend_id))
                conn.commit()
                
                return success_response({'messages': messages})
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            if path == 'thread':
                cur.execute("""
                    INSERT INTO threads (title, content, author_id, category)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, created_at
                """, (body['title'], body['content'], user_id, body['category']))
                
                thread_id, created_at = cur.fetchone()
                
                cur.execute("""
                    UPDATE users SET posts_count = posts_count + 1
                    WHERE id = %s
                """, (user_id,))
                
                conn.commit()
                return success_response({'threadId': thread_id, 'createdAt': created_at.isoformat()})
            
            elif path == 'comment':
                cur.execute("""
                    INSERT INTO comments (content, author_id, thread_id)
                    VALUES (%s, %s, %s)
                    RETURNING id, created_at
                """, (body['content'], user_id, body['threadId']))
                
                comment_id, created_at = cur.fetchone()
                
                cur.execute("""
                    UPDATE threads SET replies_count = replies_count + 1
                    WHERE id = %s
                """, (body['threadId'],))
                
                conn.commit()
                return success_response({'commentId': comment_id, 'createdAt': created_at.isoformat()})
            
            elif path == 'friend':
                friend_id = body.get('friendId')
                cur.execute("""
                    INSERT INTO friendships (user_id, friend_id)
                    VALUES (%s, %s), (%s, %s)
                    ON CONFLICT DO NOTHING
                """, (user_id, friend_id, friend_id, user_id))
                conn.commit()
                return success_response({'message': 'Friend added'})
            
            elif path == 'message':
                cur.execute("""
                    INSERT INTO messages (sender_id, receiver_id, content)
                    VALUES (%s, %s, %s)
                    RETURNING id, created_at
                """, (user_id, body['receiverId'], body['content']))
                
                msg_id, created_at = cur.fetchone()
                conn.commit()
                return success_response({'messageId': msg_id, 'createdAt': created_at.isoformat()})
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            
            if path == 'user':
                updates = []
                params = []
                
                if 'displayName' in body:
                    updates.append('display_name = %s')
                    params.append(body['displayName'])
                if 'username' in body:
                    updates.append('username = %s')
                    params.append(body['username'])
                if 'avatarUrl' in body:
                    updates.append('avatar_url = %s')
                    params.append(body['avatarUrl'])
                if 'bio' in body:
                    updates.append('bio = %s')
                    params.append(body['bio'])
                
                if updates:
                    params.append(user_id)
                    query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
                    cur.execute(query, params)
                    conn.commit()
                
                return success_response({'message': 'User updated'})
            
            elif path == 'thread':
                thread_id = body.get('threadId')
                updates = []
                params = []
                
                if 'title' in body:
                    updates.append('title = %s')
                    params.append(body['title'])
                if 'content' in body:
                    updates.append('content = %s')
                    params.append(body['content'])
                if 'isPinned' in body:
                    updates.append('is_pinned = %s')
                    params.append(body['isPinned'])
                
                updates.append('updated_at = CURRENT_TIMESTAMP')
                
                if updates:
                    params.append(thread_id)
                    query = f"UPDATE threads SET {', '.join(updates)} WHERE id = %s AND author_id = %s"
                    params.append(user_id)
                    cur.execute(query, params)
                    conn.commit()
                
                return success_response({'message': 'Thread updated'})
        
        elif method == 'DELETE':
            if path == 'friend':
                friend_id = event.get('queryStringParameters', {}).get('friendId')
                cur.execute("""
                    DELETE FROM friendships
                    WHERE (user_id = %s AND friend_id = %s)
                       OR (user_id = %s AND friend_id = %s)
                """, (user_id, friend_id, friend_id, user_id))
                conn.commit()
                return success_response({'message': 'Friend removed'})
        
        return error_response('Invalid action', 400)
    
    except Exception as e:
        return error_response(str(e), 500)
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

def success_response(data: dict) -> dict:
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data),
        'isBase64Encoded': False
    }

def error_response(message: str, status_code: int = 500) -> dict:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }
