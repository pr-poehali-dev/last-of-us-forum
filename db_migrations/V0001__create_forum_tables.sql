CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    level INTEGER DEFAULT 1,
    reputation INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS threads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    category VARCHAR(50) NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    thread_id INTEGER REFERENCES threads(id),
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS friendships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    friend_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    badge_name VARCHAR(50) NOT NULL,
    badge_icon VARCHAR(10) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS thread_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    thread_id INTEGER REFERENCES threads(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, thread_id)
);

CREATE TABLE IF NOT EXISTS comment_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    comment_id INTEGER REFERENCES comments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, comment_id)
);

CREATE INDEX IF NOT EXISTS idx_threads_category ON threads(category);
CREATE INDEX IF NOT EXISTS idx_threads_created_at ON threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_thread_id ON comments(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id);

INSERT INTO users (username, display_name, avatar_url, bio, level, reputation, posts_count) VALUES
('joel_miller', 'Joel Miller', 'https://cdn.poehali.dev/projects/a80e004a-6913-466a-8e55-6ed583e8499f/files/acd40e36-2b37-488f-aaf0-17b4b73d9d3e.jpg', 'Опытный выживший. Люблю стелс-прохождения и сбор всех коллекционных предметов.', 47, 4892, 1247),
('ellie_williams', 'Ellie Williams', 'https://cdn.poehali.dev/projects/a80e004a-6913-466a-8e55-6ed583e8499f/files/69eb8231-8692-46ff-b824-3f31e484a3d0.jpg', 'Фанат серии TLOU. Обожаю обсуждать теории и лор игры.', 42, 3654, 982),
('tommy_texas', 'Tommy Texas', 'https://cdn.poehali.dev/projects/a80e004a-6913-466a-8e55-6ed583e8499f/files/8689afa4-7357-4569-b416-9b794e552ec3.jpg', 'Прохожу игру в 5-й раз. Всегда рад помочь новичкам советом.', 38, 2891, 756);

INSERT INTO user_badges (user_id, badge_name, badge_icon) VALUES
(1, 'Легенда', '👑'),
(1, 'Светлячок', '🔥'),
(1, 'Охотник', '🏹'),
(2, 'Светлячок', '🔥'),
(2, 'Охотник', '🏹'),
(2, 'Споры', '🍄');

INSERT INTO threads (title, content, author_id, category, is_pinned, views_count, likes_count, replies_count) VALUES
('Тактика прохождения больницы без обнаружения', 'Делюсь проверенной тактикой стелс-прохождения больницы. Главное - не торопиться и использовать слух для обнаружения врагов.', 1, 'Гайды', true, 1203, 89, 47),
('Новый трейлер сезона 2 - разбор кадров', 'Вышел новый трейлер! Разбираю все детали и пасхалки из показанных кадров.', 2, 'Новости', true, 2456, 156, 89),
('Лучшие моменты из The Last of Us Part II', 'Собрал топ-10 самых эмоциональных моментов из второй части.', 3, 'Видео', false, 892, 67, 34);

INSERT INTO comments (content, author_id, thread_id, likes_count) VALUES
('Отличная тактика! Особенно момент с отвлечением кликеров камнями работает идеально.', 3, 1, 12),
('Пробовал этот метод, но застрял на моменте с бегунами. Есть советы?', 2, 1, 5),
('Для бегунов лучше использовать коктейли Молотова, они моментально их убивают.', 1, 1, 18);

INSERT INTO friendships (user_id, friend_id) VALUES
(1, 2),
(2, 1),
(1, 3),
(3, 1);