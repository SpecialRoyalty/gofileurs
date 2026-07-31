import { db } from './db.js';
const sql = `
CREATE TABLE IF NOT EXISTS users(
 telegram_id BIGINT PRIMARY KEY, username TEXT, first_name TEXT NOT NULL DEFAULT '', notifications BOOLEAN NOT NULL DEFAULT TRUE,
 invite_balance INT NOT NULL DEFAULT 0, invite_total INT NOT NULL DEFAULT 0, free_claims INT NOT NULL DEFAULT 0,
 active_campaign_id BIGINT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS campaigns(
 id BIGSERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, media_file_id TEXT, media_type TEXT,
 access_type TEXT NOT NULL CHECK(access_type IN ('free','paid','invite')), target INT, gofile_url TEXT NOT NULL,
 price_text TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','closed')),
 message_id BIGINT, created_by BIGINT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), published_at TIMESTAMPTZ
);
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_active_campaign_id_fkey;
ALTER TABLE users ADD CONSTRAINT users_active_campaign_id_fkey FOREIGN KEY(active_campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL;
CREATE TABLE IF NOT EXISTS invite_links(
 id BIGSERIAL PRIMARY KEY, owner_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
 invite_link TEXT NOT NULL UNIQUE, telegram_link_name TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), revoked_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS invite_joins(
 id BIGSERIAL PRIMARY KEY, invitee_id BIGINT NOT NULL, inviter_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
 invite_link TEXT NOT NULL, joined_at TIMESTAMPTZ NOT NULL DEFAULT now(), validate_at TIMESTAMPTZ NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','counted','left','rejected')), UNIQUE(invitee_id)
);
CREATE TABLE IF NOT EXISTS entitlements(
 id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
 campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE, status TEXT NOT NULL DEFAULT 'granted',
 granted_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(user_id,campaign_id)
);
CREATE TABLE IF NOT EXISTS reports(
 id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(telegram_id), campaign_id BIGINT REFERENCES campaigns(id),
 kind TEXT NOT NULL CHECK(kind IN ('bug','problem')), body TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS banned_words(word TEXT PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS sessions(user_id BIGINT PRIMARY KEY, flow TEXT NOT NULL, step TEXT NOT NULL, data JSONB NOT NULL DEFAULT '{}', updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS scheduled_ads(
 id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, body TEXT NOT NULL, media_file_id TEXT, media_type TEXT,
 enabled BOOLEAN NOT NULL DEFAULT TRUE, last_sent_at TIMESTAMPTZ, created_by BIGINT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app_settings(key TEXT PRIMARY KEY, value JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
INSERT INTO app_settings(key,value) VALUES('ad_rotation','{"next_at":null,"last_message_id":null,"last_ad_id":null}') ON CONFLICT(key) DO NOTHING;
CREATE INDEX IF NOT EXISTS invite_joins_pending_idx ON invite_joins(status,validate_at);
`;
await db.query(sql); await db.end(); console.log('Database ready');
