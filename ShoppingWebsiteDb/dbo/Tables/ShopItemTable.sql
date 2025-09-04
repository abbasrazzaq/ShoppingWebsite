CREATE TABLE [dbo].[ShopItemTable] (
    [Id]       INT           IDENTITY (1, 1) NOT NULL,
    [Name]     NVARCHAR (50) NOT NULL,
    [Price]    FLOAT (53)    NOT NULL,
    [Stock]    INT           NOT NULL,
    [Category] INT           NOT NULL,
    CONSTRAINT [PK_ShopItemTable] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [chk_stock_not_negative] CHECK ([Stock]>=(0))
);

