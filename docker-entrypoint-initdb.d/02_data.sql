INSERT INTO users(id, login, password, name, avatar) VALUES
('e613b714-b47d-4ad2-af66-312f04071154', 'vasya', '$2b$12$vvmvZJMDH9g4bOluIHW1/u8eOs2k53DdQjYt50./46P2fP2PEC3oO', 'Vasya', 'https://i.pravatar.cc/40'),
('10b4909c-61f3-4e81-873d-ca54e5efe30c', 'petya', '$2b$12$BADpwCGLJeStqTKjl5R9z.jCr..RVN1bSKjohQID6frFgRk6YQa/m', 'Petya', 'https://i.pravatar.cc/40');

INSERT INTO transactions(id, userid, amount, description) VALUES
('d7d6bdbb-65e3-47a5-960e-19e275c7e515', 'e613b714-b47d-4ad2-af66-312f04071154', 100, 'пополнение баланса'),
('c718aeab-fd91-4783-9bae-720687119e9d', 'e613b714-b47d-4ad2-af66-312f04071154', 100, 'пополнение баланса'),
('c983d898-170e-4083-b882-ddd62011678d', '10b4909c-61f3-4e81-873d-ca54e5efe30c', -100, 'перевод'),
('6de04941-6df1-4323-8ee5-1be25406125b', 'e613b714-b47d-4ad2-af66-312f04071154', -1, 'комиссия за обслуживание');
