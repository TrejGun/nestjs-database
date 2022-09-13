USE
master;
GO


    IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'asuDevelopment')
BEGIN
  CREATE
DATABASE asuDevelopment;
END;
GO

USE asuDevelopment;
GO
