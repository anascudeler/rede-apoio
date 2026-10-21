CREATE DATABASE IF NOT EXISTS safekey CHARACTER SET utf8mb4;
USE safekey;

CREATE TABLE Usuario (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  nome  VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,          -- hash bcrypt, nunca texto puro
  idade INT NULL,
  foto  MEDIUMTEXT NULL                 -- data URL (base64) ou URL
);

CREATE TABLE Localizacao (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  fk_Usuario_id INT NOT NULL,
  lat           DOUBLE NOT NULL,
  lng           DOUBLE NOT NULL,
  date_time     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (fk_Usuario_id, date_time),
  CONSTRAINT FK_Localizacao_1 FOREIGN KEY (fk_Usuario_id) REFERENCES Usuario (id)
);

-- eu = pessoa que é vista; quem_me_ve = pessoa que acompanha
CREATE TABLE Assistir (
  id                       INT AUTO_INCREMENT PRIMARY KEY,
  fk_Usuario_id_eu         INT NOT NULL,
  fk_Usuario_id_quem_me_ve INT NOT NULL,
  status                   VARCHAR(20) NOT NULL DEFAULT 'normal',  -- 'normal' | 'alerta'
  UNIQUE (fk_Usuario_id_eu, fk_Usuario_id_quem_me_ve),
  CONSTRAINT FK_Assistir_1 FOREIGN KEY (fk_Usuario_id_eu)         REFERENCES Usuario (id),
  CONSTRAINT FK_Assistir_2 FOREIGN KEY (fk_Usuario_id_quem_me_ve) REFERENCES Usuario (id)
);