USE [ShoppingWebsite];

-------------------------------------------------
------------------ CategoryTable ----------------
-------------------------------------------------
INSERT INTO [dbo].[CategoryTable] (Id, Category)
VALUES	(0, 'Misc'),
		(1, 'Books'),
		(2, 'Groceries'),
		(3, 'DIY'),
		(4, 'Clothing');

-------------------------------------------------
------------------- UserTable -------------------
-------------------------------------------------
INSERT INTO [dbo].[UserTable] (Username, Password, BankBalance)
VALUES('abbas', 'AQAAAAIAAYagAAAAEGJeeVmBscPi6v5BVRsEV2Hwl3JvP/EHcm1irDrpkSXV4sfYaTdpTIksQ6TD9mfLgQ==', 1500);
-------------------------------------------------

---------------------------------------------------------
--------------------- ShopItemTable ---------------------
---------------------------------------------------------
--DBCC CHECKIDENT('ShopItemTable', RESEED, 0);

--0	Misc
--1	Books
--2	Groceries
--3	DIY
--4	Clothing

INSERT INTO [dbo].[ShopItemTable]
VALUES  ('Trainers',        67,     11,         4),
        ('Hammer',          34,     19,         3),
        ('Cheese',          1.3,     7,         2),
        ('Life of Pi',       4,      3,         1),
        ('Screw',            1,    221,         3),
        ('Shoes',           12,      1,         4),
        ('Saw',             14,     22,         3),
        ('The Catcher in the Rye', 13.2, 21,    1),
        ('Apple',            4.2,   12,         2),
        ('Milk',             1.5,    4,         2),
        ('Jeans',           45,     25,         4),
        ('Ketchup',          3.4,    8,         2),
        ('Harry Potter',     3.5,    1,         1),
        ('Screwdriver',     23,     87,         3),
        ('To Kill a Mockingbird', 9.3, 17,      1),
        ('Nail',             0.5,  323,         3),
        ('Mayonnaise',       4.25, 116,         2),
        ('Bread',            2.2,   56,         2),
        ('Jumper',          33,      3,         4),
        ('Spanner',          5,     25,         3),
        ('1984',             8.7,   13,         1),
        ('T-shirt',          5,     67,         4);


SELECT TOP (1000) [Id]
      ,[Name]
      ,[Price]
      ,[Stock]
      ,[Category]
  FROM [ShoppingWebsite].[dbo].[ShopItemTable]


--INSERT INTO [ShoppingWebsite].[dbo].[ShopItemTable]
--VALUES  ('Harry Potter',    3.5,    1,          1),
--        ('Hammer',          34,     19,         3),
--        ('Mayonnaise',      4.25,   116,        2),
--        -- Books ( 1 )
--        ('1984',            8.7,    13,         1),
--        ('To Kill a Mockingbird', 9.3,  17,     1),
--        ('The Catcher in the Rye', 13.2,    21, 1),
--        ('Life of Pi',          4,          3,  1),
--	    -- Groceries ( 2 )
--        ('Bread',           2.2,   56,         2),
--        ('Milk',            1.5,    4,          2),
--        ('Apple',           4.2,    12,         2),
--        ('Ketchup',         3.4,    8,          2),
--        ('Cheese',          1.3,    7,          2),
--	    -- DIY  ( 3 )
--        ('Spanner',         5,          25,         3),
--        ('Screwdriver',     23,         87,         3),
--        ('Saw',             14,         22,         3),
--        ('Nail',            0.5,        323,        3),
--        ('Screw',           1,          221,        3),
--	    -- Clothing ( 4 )
--        ('Jeans',           45,      25,            4),
--        ('T-shirt',         5,      67,             4),
--        ('Trainers',        67,     11,             4),
--        ('Jumper',          33,      3,             4),
--        ('Shoes',           12,     1,              4)
--;