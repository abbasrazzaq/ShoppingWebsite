CREATE TABLE [dbo].[UserTable] (
    [Id]          INT             IDENTITY (1, 1) NOT NULL,
    [Username]    NVARCHAR (50)   NOT NULL,
    [Password]    NVARCHAR (50)   NOT NULL,
    [BankBalance] DECIMAL (18, 2) NULL,
    CONSTRAINT [PK_UserTable] PRIMARY KEY CLUSTERED ([Id] ASC)
);

