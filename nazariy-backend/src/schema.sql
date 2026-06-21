-- ─── Nazariy Avtotest — MySQL sxemasi ───
-- Prisma sxemasidan (schema.prisma) o'girilgan. ID'lar uchun genId() (utils/id.js) ishlatiladi.
-- Jadvallar bog'liqlik (foreign key) tartibida yaratiladi.
SET NAMES utf8mb4;

-- ─── FOYDALANUVCHI ───
CREATE TABLE IF NOT EXISTS User (
  id            VARCHAR(32)  NOT NULL PRIMARY KEY,
  tgId          VARCHAR(64)  NOT NULL UNIQUE,
  username      VARCHAR(255),
  firstName     VARCHAR(255),
  lastName      VARCHAR(255),
  photoUrl      VARCHAR(512),

  isPro         TINYINT(1)   NOT NULL DEFAULT 0,
  proExpiresAt  DATETIME     NULL,

  referralCode  VARCHAR(32)  NOT NULL UNIQUE,
  invitedById   VARCHAR(32)  NULL,

  adminRole     VARCHAR(32)  NULL,
  adminPerms    TEXT         NULL,

  createdAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (invitedById) REFERENCES User(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── MAVZULAR ───
CREATE TABLE IF NOT EXISTS Topic (
  id        VARCHAR(32)  NOT NULL PRIMARY KEY,
  titleUz   VARCHAR(255) NOT NULL,
  titleRu   VARCHAR(255) NOT NULL,
  titleKril VARCHAR(255) NOT NULL,
  color     VARCHAR(16)  NOT NULL,
  icon      VARCHAR(32)  NOT NULL DEFAULT 'book',
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── BILETLAR ───
CREATE TABLE IF NOT EXISTS Ticket (
  id        INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  number    INT          NOT NULL UNIQUE,
  isPro     TINYINT(1)   NOT NULL DEFAULT 0,
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── SAVOLLAR ───
CREATE TABLE IF NOT EXISTS Question (
  id          VARCHAR(32)  NOT NULL PRIMARY KEY,
  ticketId    INT          NOT NULL,
  `order`     INT          NOT NULL DEFAULT 0,

  questionUz  TEXT         NOT NULL,
  questionRu  TEXT         NOT NULL,
  questionKril TEXT        NOT NULL,

  optionsJson TEXT         NOT NULL,

  correct     INT          NOT NULL DEFAULT 0,
  image       VARCHAR(512) NULL,

  explanationUz   TEXT     NULL,
  explanationRu   TEXT     NULL,
  explanationKril TEXT     NULL,

  topicId     VARCHAR(32)  NULL,

  FOREIGN KEY (ticketId) REFERENCES Ticket(id) ON DELETE CASCADE,
  FOREIGN KEY (topicId) REFERENCES Topic(id) ON DELETE SET NULL,
  INDEX idx_question_ticket (ticketId),
  INDEX idx_question_topic (topicId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── YO'L QOIDALARI TOIFALARI ───
CREATE TABLE IF NOT EXISTS RuleCategory (
  id        VARCHAR(32)  NOT NULL PRIMARY KEY,
  titleUz   VARCHAR(255) NOT NULL,
  titleRu   VARCHAR(255) NOT NULL,
  titleKril VARCHAR(255) NOT NULL,
  descUz    TEXT NULL,
  descRu    TEXT NULL,
  descKril  TEXT NULL,
  color     VARCHAR(16)  NOT NULL,
  icon      VARCHAR(32)  NOT NULL DEFAULT 'info',
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── YO'L QOIDALARI BELGILARI ───
CREATE TABLE IF NOT EXISTS RuleItem (
  id         VARCHAR(32)  NOT NULL PRIMARY KEY,
  categoryId VARCHAR(32)  NOT NULL,
  titleUz    VARCHAR(255) NOT NULL,
  titleRu    VARCHAR(255) NOT NULL,
  titleKril  VARCHAR(255) NOT NULL,
  descUz     TEXT NULL,
  descRu     TEXT NULL,
  descKril   TEXT NULL,
  image      VARCHAR(512) NULL,
  `order`    INT NOT NULL DEFAULT 0,

  FOREIGN KEY (categoryId) REFERENCES RuleCategory(id) ON DELETE CASCADE,
  INDEX idx_ruleitem_category (categoryId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── TASDIQLASH KUTAYOTGAN O'ZGARISHLAR ───
CREATE TABLE IF NOT EXISTS PendingChange (
  id          VARCHAR(32)  NOT NULL PRIMARY KEY,
  type        VARCHAR(64)  NOT NULL,
  payloadJson TEXT         NOT NULL,
  description VARCHAR(512) NOT NULL,

  adminId     VARCHAR(32)  NOT NULL,
  status      VARCHAR(16)  NOT NULL DEFAULT 'pending',

  createdAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolvedAt  DATETIME     NULL,

  FOREIGN KEY (adminId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_pendingchange_admin (adminId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── PRO OBUNA SO'ROVLARI ───
CREATE TABLE IF NOT EXISTS ProRequest (
  id         VARCHAR(32)  NOT NULL PRIMARY KEY,
  userId     VARCHAR(32)  NOT NULL,

  planLabel  VARCHAR(32)  NOT NULL,
  planDays   INT          NOT NULL,
  amount     INT          NOT NULL,

  receiptUrl VARCHAR(512) NULL,
  status     VARCHAR(16)  NOT NULL DEFAULT 'pending',

  createdAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolvedAt DATETIME     NULL,

  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_prorequest_user (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── REFERAL ORQALI PRO BERISH ───
CREATE TABLE IF NOT EXISTS ReferralGrant (
  id             VARCHAR(32)  NOT NULL PRIMARY KEY,
  userId         VARCHAR(32)  NOT NULL,

  milestoneCount INT          NOT NULL,
  days           INT          NOT NULL,

  status         VARCHAR(16)  NOT NULL DEFAULT 'pending',
  createdAt      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolvedAt     DATETIME     NULL,

  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_referralgrant_user (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── BILDIRISHNOMALAR ───
CREATE TABLE IF NOT EXISTS Notification (
  id        VARCHAR(32)  NOT NULL PRIMARY KEY,
  type      VARCHAR(32)  NOT NULL,
  titleUz   VARCHAR(255) NOT NULL,
  titleRu   VARCHAR(255) NOT NULL,
  titleKril VARCHAR(255) NOT NULL,
  bodyUz    TEXT NOT NULL,
  bodyRu    TEXT NOT NULL,
  bodyKril  TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── BILDIRISHNOMA O'QILGANLIK HOLATI ───
CREATE TABLE IF NOT EXISTS UserNotification (
  id             VARCHAR(32)  NOT NULL PRIMARY KEY,
  userId         VARCHAR(32)  NOT NULL,
  notificationId VARCHAR(32)  NOT NULL,
  `read`         TINYINT(1)   NOT NULL DEFAULT 0,

  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (notificationId) REFERENCES Notification(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_notification (userId, notificationId),
  INDEX idx_usernotif_user (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── TEST/IMTIHON NATIJALARI ───
CREATE TABLE IF NOT EXISTS TestResult (
  id        VARCHAR(32)  NOT NULL PRIMARY KEY,
  userId    VARCHAR(32)  NOT NULL,

  type      VARCHAR(16)  NOT NULL,
  correct   INT NOT NULL,
  wrong     INT NOT NULL,
  total     INT NOT NULL,

  topicMistakesJson TEXT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_testresult_user (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── UMUMIY SOZLAMALAR ───
CREATE TABLE IF NOT EXISTS Setting (
  `key`     VARCHAR(64) NOT NULL PRIMARY KEY,
  valueJson TEXT NOT NULL,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── DUEL ───
CREATE TABLE IF NOT EXISTS Duel (
  id          VARCHAR(32)  NOT NULL PRIMARY KEY,

  creatorId   VARCHAR(32)  NOT NULL,
  opponentId  VARCHAR(32)  NULL,

  questionIds TEXT         NOT NULL,

  creatorScore  INT NULL,
  opponentScore INT NULL,
  creatorDone   TINYINT(1) NOT NULL DEFAULT 0,
  opponentDone  TINYINT(1) NOT NULL DEFAULT 0,

  status      VARCHAR(16) NOT NULL DEFAULT 'waiting',
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (creatorId) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (opponentId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_duel_creator (creatorId),
  INDEX idx_duel_opponent (opponentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
