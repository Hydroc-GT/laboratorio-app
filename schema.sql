USE [master]
GO
/****** Object:  Database [LaboratorioControlCalidad]    Script Date: 9/26/2026 6:08:58 PM ******/
CREATE DATABASE [LaboratorioControlCalidad]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'LaboratorioControlCalidad', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.DEVSERVER\MSSQL\DATA\LaboratorioControlCalidad.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'LaboratorioControlCalidad_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.DEVSERVER\MSSQL\DATA\LaboratorioControlCalidad_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [LaboratorioControlCalidad] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [LaboratorioControlCalidad].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [LaboratorioControlCalidad] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET ARITHABORT OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET  ENABLE_BROKER 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET RECOVERY FULL 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET  MULTI_USER 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [LaboratorioControlCalidad] SET DB_CHAINING OFF 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [LaboratorioControlCalidad] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'LaboratorioControlCalidad', N'ON'
GO
ALTER DATABASE [LaboratorioControlCalidad] SET QUERY_STORE = ON
GO
ALTER DATABASE [LaboratorioControlCalidad] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [LaboratorioControlCalidad]
GO
/****** Object:  Table [dbo].[AuditoriaActividades]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AuditoriaActividades](
	[IdAuditoria] [int] IDENTITY(1,1) NOT NULL,
	[IdUsuario] [int] NULL,
	[Accion] [nvarchar](100) NOT NULL,
	[Detalles] [nvarchar](max) NULL,
	[Fecha] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IdAuditoria] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Certificados]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Certificados](
	[IdCertificado] [int] IDENTITY(1,1) NOT NULL,
	[IdMuestra] [int] NOT NULL,
	[FechaEmision] [datetime] NOT NULL,
	[ResultadoGlobal] [nvarchar](20) NOT NULL,
	[Observaciones] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[IdCertificado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Muestras]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Muestras](
	[IdMuestra] [int] IDENTITY(1,1) NOT NULL,
	[IdTipoMuestra] [int] NOT NULL,
	[CodigoUnico] [nvarchar](50) NOT NULL,
	[FechaRecepcion] [datetime] NOT NULL,
	[Origen] [nvarchar](200) NULL,
	[CondicionesTransporte] [nvarchar](200) NULL,
	[Estado] [nvarchar](50) NOT NULL,
	[IdSolicitante] [int] NOT NULL,
	[IdResponsable] [int] NULL,
	[Comentarios] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[IdMuestra] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[CodigoUnico] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Normas]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Normas](
	[IdNorma] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[Descripcion] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[IdNorma] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Parametros]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Parametros](
	[IdParametro] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[Unidad] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IdParametro] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ParametrosNorma]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ParametrosNorma](
	[IdParametroNorma] [int] IDENTITY(1,1) NOT NULL,
	[IdNorma] [int] NOT NULL,
	[IdParametro] [int] NOT NULL,
	[ValorMin] [decimal](10, 2) NULL,
	[ValorMax] [decimal](10, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[IdParametroNorma] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[IdNorma] ASC,
	[IdParametro] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Resultados]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Resultados](
	[IdResultado] [int] IDENTITY(1,1) NOT NULL,
	[IdMuestra] [int] NOT NULL,
	[IdParametroNorma] [int] NOT NULL,
	[ValorObtenido] [decimal](10, 2) NOT NULL,
	[Cumple] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IdResultado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[IdRol] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IdRol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Solicitantes]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Solicitantes](
	[IdSolicitante] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[TipoSolicitante] [nvarchar](50) NOT NULL,
	[DocumentoIdentidad] [nvarchar](50) NOT NULL,
	[Direccion] [nvarchar](200) NULL,
	[Telefono] [nvarchar](20) NULL,
	[Correo] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[IdSolicitante] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[DocumentoIdentidad] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TipoMuestra]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TipoMuestra](
	[IdTipoMuestra] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IdTipoMuestra] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TipoMuestraNormas]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TipoMuestraNormas](
	[IdTipoMuestra] [int] NOT NULL,
	[IdNorma] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IdTipoMuestra] ASC,
	[IdNorma] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuarios]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuarios](
	[IdUsuario] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[Correo] [nvarchar](100) NOT NULL,
	[Contrasena] [nvarchar](255) NOT NULL,
	[IdRol] [int] NOT NULL,
	[Estado] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[IdUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Correo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AuditoriaActividades_Accion]    Script Date: 9/26/2026 6:08:58 PM ******/
CREATE NONCLUSTERED INDEX [IX_AuditoriaActividades_Accion] ON [dbo].[AuditoriaActividades]
(
	[Accion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_AuditoriaActividades_Fecha]    Script Date: 9/26/2026 6:08:58 PM ******/
CREATE NONCLUSTERED INDEX [IX_AuditoriaActividades_Fecha] ON [dbo].[AuditoriaActividades]
(
	[Fecha] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_AuditoriaActividades_IdUsuario]    Script Date: 9/26/2026 6:08:58 PM ******/
CREATE NONCLUSTERED INDEX [IX_AuditoriaActividades_IdUsuario] ON [dbo].[AuditoriaActividades]
(
	[IdUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AuditoriaActividades] ADD  DEFAULT (getdate()) FOR [Fecha]
GO
ALTER TABLE [dbo].[Certificados] ADD  DEFAULT (getdate()) FOR [FechaEmision]
GO
ALTER TABLE [dbo].[Muestras] ADD  DEFAULT (getdate()) FOR [FechaRecepcion]
GO
ALTER TABLE [dbo].[Muestras] ADD  DEFAULT ('Recibida') FOR [Estado]
GO
ALTER TABLE [dbo].[Usuarios] ADD  DEFAULT ('Activo') FOR [Estado]
GO
ALTER TABLE [dbo].[AuditoriaActividades]  WITH CHECK ADD FOREIGN KEY([IdUsuario])
REFERENCES [dbo].[Usuarios] ([IdUsuario])
GO
ALTER TABLE [dbo].[Certificados]  WITH CHECK ADD FOREIGN KEY([IdMuestra])
REFERENCES [dbo].[Muestras] ([IdMuestra])
GO
ALTER TABLE [dbo].[Muestras]  WITH CHECK ADD FOREIGN KEY([IdResponsable])
REFERENCES [dbo].[Usuarios] ([IdUsuario])
GO
ALTER TABLE [dbo].[Muestras]  WITH CHECK ADD FOREIGN KEY([IdSolicitante])
REFERENCES [dbo].[Solicitantes] ([IdSolicitante])
GO
ALTER TABLE [dbo].[Muestras]  WITH CHECK ADD FOREIGN KEY([IdTipoMuestra])
REFERENCES [dbo].[TipoMuestra] ([IdTipoMuestra])
GO
ALTER TABLE [dbo].[ParametrosNorma]  WITH CHECK ADD FOREIGN KEY([IdNorma])
REFERENCES [dbo].[Normas] ([IdNorma])
GO
ALTER TABLE [dbo].[ParametrosNorma]  WITH CHECK ADD FOREIGN KEY([IdParametro])
REFERENCES [dbo].[Parametros] ([IdParametro])
GO
ALTER TABLE [dbo].[Resultados]  WITH CHECK ADD FOREIGN KEY([IdMuestra])
REFERENCES [dbo].[Muestras] ([IdMuestra])
GO
ALTER TABLE [dbo].[Resultados]  WITH CHECK ADD FOREIGN KEY([IdParametroNorma])
REFERENCES [dbo].[ParametrosNorma] ([IdParametroNorma])
GO
ALTER TABLE [dbo].[TipoMuestraNormas]  WITH CHECK ADD FOREIGN KEY([IdNorma])
REFERENCES [dbo].[Normas] ([IdNorma])
GO
ALTER TABLE [dbo].[TipoMuestraNormas]  WITH CHECK ADD FOREIGN KEY([IdNorma])
REFERENCES [dbo].[Normas] ([IdNorma])
GO
ALTER TABLE [dbo].[TipoMuestraNormas]  WITH CHECK ADD FOREIGN KEY([IdTipoMuestra])
REFERENCES [dbo].[TipoMuestra] ([IdTipoMuestra])
GO
ALTER TABLE [dbo].[TipoMuestraNormas]  WITH CHECK ADD FOREIGN KEY([IdTipoMuestra])
REFERENCES [dbo].[TipoMuestra] ([IdTipoMuestra])
GO
ALTER TABLE [dbo].[Usuarios]  WITH CHECK ADD FOREIGN KEY([IdRol])
REFERENCES [dbo].[Roles] ([IdRol])
GO
ALTER TABLE [dbo].[Certificados]  WITH CHECK ADD CHECK  (([ResultadoGlobal]='Rechazado' OR [ResultadoGlobal]='Aprobado'))
GO
ALTER TABLE [dbo].[Muestras]  WITH CHECK ADD CHECK  (([Estado]='Devuelta' OR [Estado]='Certificada' OR [Estado]='Evaluada' OR [Estado]='EnAnalisis' OR [Estado]='Recibida'))
GO
ALTER TABLE [dbo].[Solicitantes]  WITH CHECK ADD CHECK  (([TipoSolicitante]='Empresa' OR [TipoSolicitante]='Persona'))
GO
ALTER TABLE [dbo].[Usuarios]  WITH CHECK ADD CHECK  (([Estado]='Inactivo' OR [Estado]='Activo'))
GO
/****** Object:  StoredProcedure [dbo].[ActualizarEstadoMuestra]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[ActualizarEstadoMuestra]
    @IdMuestra INT,
    @NuevoEstado NVARCHAR(50),
    @Comentarios NVARCHAR(500) = NULL
AS
BEGIN
    UPDATE Muestras
    SET 
        Estado = @NuevoEstado,
        Comentarios = @Comentarios
    WHERE 
        IdMuestra = @IdMuestra;
END;
GO
/****** Object:  StoredProcedure [dbo].[AprobarMuestra]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para aprobar y pasar la muestra al cliente
CREATE PROCEDURE [dbo].[AprobarMuestra]
    @IdMuestra INT
AS
BEGIN
    UPDATE Muestras
    SET
        Estado = 'Certificada'
    WHERE
        IdMuestra = @IdMuestra;
END;
GO
/****** Object:  StoredProcedure [dbo].[AsignarAnalistaAMuestra]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para asignar una muestra a un analista
CREATE PROCEDURE [dbo].[AsignarAnalistaAMuestra]
    @IdMuestra INT,
    @IdAnalista INT,
    @Comentarios NVARCHAR(500) = NULL
AS
BEGIN
    UPDATE Muestras
    SET
        IdResponsable = @IdAnalista,
        Estado = 'EnAnalisis',
        Comentarios = @Comentarios -- Se usa para pasar comentarios del validador al analista
    WHERE
        IdMuestra = @IdMuestra;
END;
GO
/****** Object:  StoredProcedure [dbo].[ConsultarAuditoria]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[ConsultarAuditoria]
    @Usuario NVARCHAR(100) = NULL,
    @Accion NVARCHAR(100) = NULL,
    @FechaInicio DATE = NULL,
    @FechaFin DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.IdAuditoria,
        a.IdUsuario,
        u.Nombre AS NombreUsuario, -- <--- Cambiado aquí
        u.Correo,
        a.Accion,
        a.Detalles,
        a.Fecha
    FROM 
        AuditoriaActividades a
        LEFT JOIN Usuarios u ON a.IdUsuario = u.IdUsuario
    WHERE 
        (@Usuario IS NULL OR u.Correo LIKE '%' + @Usuario + '%' OR u.Nombre LIKE '%' + @Usuario + '%') -- <--- Cambiado aquí
        AND (@Accion IS NULL OR a.Accion LIKE '%' + @Accion + '%')
        AND (@FechaInicio IS NULL OR CAST(a.Fecha AS DATE) >= @FechaInicio)
        AND (@FechaFin IS NULL OR CAST(a.Fecha AS DATE) <= @FechaFin)
    ORDER BY 
        a.Fecha DESC;
END;
GO
/****** Object:  StoredProcedure [dbo].[CrearMuestra]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-------------------------------------------------------

-- Procedimiento para crear una nueva muestra
CREATE PROCEDURE [dbo].[CrearMuestra]
     @IdTipoMuestra INT,
    @CodigoUnico NVARCHAR(50),
    @Origen NVARCHAR(200),
    @CondicionesTransporte NVARCHAR(200),
    @IdSolicitante INT
AS
BEGIN
    INSERT INTO Muestras (IdTipoMuestra, CodigoUnico, Origen, CondicionesTransporte, IdSolicitante)
    VALUES (@IdTipoMuestra, @CodigoUnico, @Origen, @CondicionesTransporte, @IdSolicitante);

    SELECT SCOPE_IDENTITY() AS IdMuestra;
END;
GO
/****** Object:  StoredProcedure [dbo].[CrearNorma]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-------------------------------------------------------

-- Procedimiento para crear una nueva norma
CREATE PROCEDURE [dbo].[CrearNorma]
    @Nombre NVARCHAR(100),
    @Descripcion NVARCHAR(500)
AS
BEGIN
    INSERT INTO Normas (Nombre, Descripcion)
    VALUES (@Nombre, @Descripcion);
END;
GO
/****** Object:  StoredProcedure [dbo].[CrearParametro]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-------------------------------------------------------

-- Procedimiento para crear un nuevo parámetro
CREATE PROCEDURE [dbo].[CrearParametro]
    @Nombre NVARCHAR(100),
    @Unidad NVARCHAR(20)
AS
BEGIN
    INSERT INTO Parametros (Nombre, Unidad)
    VALUES (@Nombre, @Unidad);
END;
GO
/****** Object:  StoredProcedure [dbo].[CrearRol]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para crear un nuevo rol
CREATE PROCEDURE [dbo].[CrearRol]
    @Nombre NVARCHAR(50)
AS
BEGIN
    INSERT INTO Roles (Nombre)
    VALUES (@Nombre);
END;
GO
/****** Object:  StoredProcedure [dbo].[CrearSolicitante]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-------------------------------------------------------

-- Procedimiento para crear un nuevo solicitante
CREATE PROCEDURE [dbo].[CrearSolicitante]
    @Nombre NVARCHAR(100),
    @TipoSolicitante NVARCHAR(50),
    @DocumentoIdentidad NVARCHAR(50),
    @Direccion NVARCHAR(200),
    @Telefono NVARCHAR(20),
    @Correo NVARCHAR(100)
AS
BEGIN
    INSERT INTO Solicitantes (Nombre, TipoSolicitante, DocumentoIdentidad, Direccion, Telefono, Correo)
    VALUES (@Nombre, @TipoSolicitante, @DocumentoIdentidad, @Direccion, @Telefono, @Correo);
END;
GO
/****** Object:  StoredProcedure [dbo].[CrearTipoMuestra]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-------------------------------------------------------

-- Procedimiento para crear un nuevo tipo de muestra
CREATE PROCEDURE [dbo].[CrearTipoMuestra]
    @Nombre NVARCHAR(50)
AS
BEGIN
    INSERT INTO TipoMuestra (Nombre)
    VALUES (@Nombre);
END;
GO
/****** Object:  StoredProcedure [dbo].[CrearUsuario]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-------------------------------------------------------

-- Procedimiento para crear un nuevo usuario
CREATE PROCEDURE [dbo].[CrearUsuario]
    @Nombre NVARCHAR(100),
    @Correo NVARCHAR(100),
    @Contrasena NVARCHAR(255),
    @IdRol INT
AS
BEGIN
    INSERT INTO Usuarios (Nombre, Correo, Contrasena, IdRol)
    VALUES (@Nombre, @Correo, @Contrasena, @IdRol);
END;
GO
/****** Object:  StoredProcedure [dbo].[DesaprobarMuestra]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para desaprobar y devolver la muestra al analista
CREATE PROCEDURE [dbo].[DesaprobarMuestra]
    @IdMuestra INT,
    @Comentarios NVARCHAR(500)
AS
BEGIN
    UPDATE Muestras
    SET
        Estado = 'Rechazada',
        Comentarios = @Comentarios
    WHERE
        IdMuestra = @IdMuestra;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetAnalistas]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para obtener la lista de usuarios con el rol de Analista
CREATE PROCEDURE [dbo].[GetAnalistas]
AS
BEGIN
    SELECT
        U.IdUsuario,
        U.Nombre
    FROM Usuarios AS U
    INNER JOIN Roles AS R ON U.IdRol = R.IdRol
    WHERE R.Nombre = 'Analista';
END;
GO
/****** Object:  StoredProcedure [dbo].[GetHistorialValidador]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para obtener el historial del validador
CREATE PROCEDURE [dbo].[GetHistorialValidador]
AS
BEGIN
    SELECT
        M.IdMuestra,
        M.CodigoUnico,
        S.Nombre AS NombreSolicitante,
        TM.Nombre AS TipoMuestra,
        C.ResultadoGlobal AS Estado, -- Usar el resultado global del certificado
        C.FechaEmision -- Usar la fecha de emisión del certificado
    FROM Muestras AS M
    INNER JOIN Solicitantes AS S ON M.IdSolicitante = S.IdSolicitante
    INNER JOIN TipoMuestra AS TM ON M.IdTipoMuestra = TM.IdTipoMuestra
    INNER JOIN Certificados AS C ON M.IdMuestra = C.IdMuestra
    WHERE C.ResultadoGlobal = 'Aprobado' OR C.ResultadoGlobal = 'Rechazado';
END;
GO
/****** Object:  StoredProcedure [dbo].[GetMuestrasParaAprobar]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para listar las muestras que el validador debe aprobar
CREATE PROCEDURE [dbo].[GetMuestrasParaAprobar]
AS
BEGIN
    SELECT
        M.IdMuestra,
        M.CodigoUnico,
        S.Nombre AS NombreSolicitante,
        TM.Nombre AS TipoMuestra,
        M.Estado
    FROM Muestras AS M
    INNER JOIN Solicitantes AS S ON M.IdSolicitante = S.IdSolicitante
    INNER JOIN TipoMuestra AS TM ON M.IdTipoMuestra = TM.IdTipoMuestra
    WHERE M.Estado = 'Evaluada' OR M.Estado = 'Rechazada';
END;
GO
/****** Object:  StoredProcedure [dbo].[GetMuestrasParaAsignar]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para listar las muestras que el validador debe asignar
CREATE PROCEDURE [dbo].[GetMuestrasParaAsignar]
AS
BEGIN
    SELECT
        M.IdMuestra,
        M.CodigoUnico,
        S.Nombre AS NombreSolicitante,
        TM.Nombre AS TipoMuestra,
        M.Estado
    FROM Muestras AS M
    INNER JOIN Solicitantes AS S ON M.IdSolicitante = S.IdSolicitante
    INNER JOIN TipoMuestra AS TM ON M.IdTipoMuestra = TM.IdTipoMuestra
    WHERE M.Estado = 'Recibida';
END;
GO
/****** Object:  StoredProcedure [dbo].[ListarMuestras]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para listar todas las muestras con información relacionada (admite filtro opcional por solicitante)
CREATE PROCEDURE [dbo].[ListarMuestras]
    @IdSolicitante INT = NULL
AS
BEGIN
    SELECT 
        M.IdMuestra,
        M.CodigoUnico,
        M.FechaRecepcion,
        M.Origen,
        M.CondicionesTransporte,
        M.Estado,
        S.Nombre AS NombreSolicitante,
        T.Nombre AS TipoMuestra,
        U.Nombre AS Responsable
    FROM 
        Muestras AS M
    INNER JOIN 
        Solicitantes AS S ON M.IdSolicitante = S.IdSolicitante
    INNER JOIN 
        TipoMuestra AS T ON M.IdTipoMuestra = T.IdTipoMuestra
    LEFT JOIN 
        Usuarios AS U ON M.IdResponsable = U.IdUsuario
    WHERE 
        (@IdSolicitante IS NULL OR M.IdSolicitante = @IdSolicitante)
    ORDER BY 
        M.IdMuestra DESC;
END;
GO

-- Procedimiento para obtener el siguiente número correlativo de muestra por tipo
CREATE PROCEDURE [dbo].[ObtenerSiguienteNumeroMuestra]
    @IdTipoMuestra INT
AS
BEGIN
    SELECT ISNULL(COUNT(*), 0) + 1 AS SiguienteNumero
    FROM Muestras
    WHERE IdTipoMuestra = @IdTipoMuestra;
END;
GO
/****** Object:  StoredProcedure [dbo].[ListarMuestrasPorAnalista]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Nuevo procedimiento para listar las muestras asignadas a un analista
CREATE PROCEDURE [dbo].[ListarMuestrasPorAnalista]
    @IdAnalista INT
AS
BEGIN
    SELECT 
        M.IdMuestra,
        M.CodigoUnico,
        M.FechaRecepcion,
        M.Estado,
        M.Comentarios,
        T.Nombre AS TipoMuestra,
        S.Nombre AS NombreSolicitante
    FROM 
        Muestras AS M
    INNER JOIN 
        TipoMuestra AS T ON M.IdTipoMuestra = T.IdTipoMuestra
    INNER JOIN 
        Solicitantes AS S ON M.IdSolicitante = S.IdSolicitante
    WHERE 
        M.IdResponsable = @IdAnalista;
END;
GO
/****** Object:  StoredProcedure [dbo].[ListarNormas]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para listar todas las normas
CREATE PROCEDURE [dbo].[ListarNormas]
AS
BEGIN
    SELECT IdNorma, Nombre, Descripcion
    FROM Normas;
END;
GO
/****** Object:  StoredProcedure [dbo].[ListarParametros]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para listar todos los parámetros
CREATE PROCEDURE [dbo].[ListarParametros]
AS
BEGIN
    SELECT IdParametro, Nombre, Unidad
    FROM Parametros;
END;
GO
/****** Object:  StoredProcedure [dbo].[ListarResultadosPorMuestra]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para listar los resultados de una muestra específica
CREATE PROCEDURE [dbo].[ListarResultadosPorMuestra]
    @IdMuestra INT
AS
BEGIN
    SELECT 
        R.IdResultado,
        P.Nombre AS NombreParametro,
        R.ValorObtenido,
        R.Cumple,
        P.Unidad,
        N.Nombre AS Norma,
        PN.ValorMin,
        PN.ValorMax
    FROM Resultados AS R
    INNER JOIN ParametrosNorma AS PN ON R.IdParametroNorma = PN.IdParametroNorma
    INNER JOIN Parametros AS P ON PN.IdParametro = P.IdParametro
    INNER JOIN Normas AS N ON PN.IdNorma = N.IdNorma
    WHERE R.IdMuestra = @IdMuestra;
END;
GO
/****** Object:  StoredProcedure [dbo].[ListarRoles]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para listar todos los roles
CREATE PROCEDURE [dbo].[ListarRoles]
AS
BEGIN
    SELECT IdRol, Nombre
    FROM Roles;
END;
GO
/****** Object:  StoredProcedure [dbo].[ListarSolicitantes]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para listar todos los solicitantes
CREATE PROCEDURE [dbo].[ListarSolicitantes]
AS
BEGIN
    SELECT 
        IdSolicitante, 
        Nombre, 
        TipoSolicitante, 
        DocumentoIdentidad, 
        Direccion, 
        Telefono, 
        Correo
    FROM 
        Solicitantes;
END;
GO
/****** Object:  StoredProcedure [dbo].[ListarTiposMuestra]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para listar todos los tipos de muestra
CREATE PROCEDURE [dbo].[ListarTiposMuestra]
AS
BEGIN
    SELECT IdTipoMuestra, Nombre
    FROM TipoMuestra;
END;
GO
/****** Object:  StoredProcedure [dbo].[ListarUsuarios]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para listar todos los usuarios
CREATE PROCEDURE [dbo].[ListarUsuarios]
AS
BEGIN
    SELECT 
        U.IdUsuario,
        U.Nombre AS NombreUsuario,
        U.Correo,
        R.Nombre AS NombreRol,
		U.Estado
    FROM 
        Usuarios AS U
    INNER JOIN 
        Roles AS R ON U.IdRol = R.IdRol;
END;
GO
/****** Object:  StoredProcedure [dbo].[LoginUsuario]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para iniciar sesión
CREATE PROCEDURE [dbo].[LoginUsuario]
    @Correo NVARCHAR(100)
AS
BEGIN
    SELECT 
        U.IdUsuario,
        U.Nombre AS NombreUsuario,
        U.Correo,
        U.Contrasena,
        R.IdRol,
        R.Nombre AS NombreRol,
		U.Estado
    FROM 
        Usuarios AS U
    INNER JOIN 
        Roles AS R ON U.IdRol = R.IdRol
    WHERE 
        U.Correo = @Correo;
END;
GO
/****** Object:  StoredProcedure [dbo].[ObtenerParametrosParaMuestra]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[ObtenerParametrosParaMuestra]
    @IdMuestra INT
AS
BEGIN
    SELECT
        PN.IdParametroNorma,
        P.Nombre AS NombreParametro,
        P.Unidad,
        PN.ValorMin,
        PN.ValorMax
    FROM
        Muestras AS M
    INNER JOIN
        TipoMuestra AS TM ON M.IdTipoMuestra = TM.IdTipoMuestra
    INNER JOIN
        TipoMuestraNormas AS TMN ON TM.IdTipoMuestra = TMN.IdTipoMuestra
    INNER JOIN
        Normas AS N ON TMN.IdNorma = N.IdNorma
    INNER JOIN
        ParametrosNorma AS PN ON N.IdNorma = PN.IdNorma
    INNER JOIN
        Parametros AS P ON PN.IdParametro = P.IdParametro
    WHERE
        M.IdMuestra = @IdMuestra;
END;
GO
/****** Object:  StoredProcedure [dbo].[ObtenerUsuarioPorId]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para obtener un usuario por su ID
CREATE PROCEDURE [dbo].[ObtenerUsuarioPorId]
    @IdUsuario INT
AS
BEGIN
    SELECT 
        U.IdUsuario,
        U.Nombre AS NombreUsuario,
        U.Correo,
        R.IdRol,
        R.Nombre AS NombreRol
    FROM 
        Usuarios AS U
    INNER JOIN 
        Roles AS R ON U.IdRol = R.IdRol
    WHERE 
        U.IdUsuario = @IdUsuario;
END;
GO
/****** Object:  StoredProcedure [dbo].[RegistrarEventoAuditoria]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[RegistrarEventoAuditoria]
    @IdUsuario INT = NULL,
    @Accion NVARCHAR(100),
    @Detalles NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO AuditoriaActividades (IdUsuario, Accion, Detalles, Fecha)
    VALUES (@IdUsuario, @Accion, @Detalles, GETDATE());
    
    SELECT SCOPE_IDENTITY() AS IdAuditoria;
END;
GO
/****** Object:  StoredProcedure [dbo].[RegistrarResultado]    Script Date: 9/26/2026 6:08:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-------------------------------------------------------
 
-- Procedimiento para registrar un nuevo resultado
CREATE PROCEDURE [dbo].[RegistrarResultado]
    @IdMuestra INT,
    @IdParametroNorma INT,
    @ValorObtenido DECIMAL(10,2),
    @Cumple BIT
AS
BEGIN
    INSERT INTO Resultados (IdMuestra, IdParametroNorma, ValorObtenido, Cumple)
    VALUES (@IdMuestra, @IdParametroNorma, @ValorObtenido, @Cumple);
END;
GO

/****** Object:  StoredProcedure [dbo].[ObtenerDatosMuestraParaCertificado] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[ObtenerDatosMuestraParaCertificado]
    @IdMuestra INT
AS
BEGIN
    SELECT 
        M.IdMuestra,
        M.CodigoUnico,
        M.FechaRecepcion,
        ISNULL(S.Nombre, 'Sin Solicitante') AS NombreSolicitante,
        ISNULL(TM.Nombre, 'General') AS TipoMuestra
    FROM Muestras M
    LEFT JOIN Solicitantes S ON M.IdSolicitante = S.IdSolicitante
    LEFT JOIN TipoMuestra TM ON M.IdTipoMuestra = TM.IdTipoMuestra
    WHERE M.IdMuestra = @IdMuestra;
END;
GO

/****** Object:  StoredProcedure [dbo].[ActualizarEstadoUsuario] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[ActualizarEstadoUsuario]
    @IdUsuario INT,
    @Estado NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Usuarios
    SET Estado = @Estado
    WHERE IdUsuario = @IdUsuario;

    SELECT IdUsuario, Nombre, Correo, IdRol, Estado
    FROM Usuarios
    WHERE IdUsuario = @IdUsuario;
END;
GO

/****** Object:  StoredProcedure [dbo].[CrearParametroNorma] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[CrearParametroNorma]
    @IdNorma INT,
    @IdParametro INT,
    @ValorMinimo DECIMAL(18, 2) = NULL,
    @ValorMaximo DECIMAL(18, 2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO ParametrosNorma (IdNorma, IdParametro, ValorMin, ValorMax)
    VALUES (@IdNorma, @IdParametro, @ValorMinimo, @ValorMaximo);
END;
GO

/****** Object:  StoredProcedure [dbo].[ListarParametrosNormaPorNorma] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[ListarParametrosNormaPorNorma]
    @IdNorma INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        PN.IdParametroNorma,
        PN.IdNorma,
        PN.IdParametro,
        P.Nombre AS NombreParametro,
        P.Unidad,
        PN.ValorMin,
        PN.ValorMax,
        PN.ValorMin AS ValorMinimo,
        PN.ValorMax AS ValorMaximo
    FROM ParametrosNorma PN
    INNER JOIN Parametros P ON PN.IdParametro = P.IdParametro
    WHERE PN.IdNorma = @IdNorma;
END;
GO

-- Población de relaciones Tipo de Muestra con Normas de Calidad
IF NOT EXISTS (SELECT 1 FROM TipoMuestraNormas WHERE IdTipoMuestra = 1 AND IdNorma = 2)
    INSERT INTO TipoMuestraNormas (IdTipoMuestra, IdNorma) VALUES (1, 2);
IF NOT EXISTS (SELECT 1 FROM TipoMuestraNormas WHERE IdTipoMuestra = 2 AND IdNorma = 1)
    INSERT INTO TipoMuestraNormas (IdTipoMuestra, IdNorma) VALUES (2, 1);
IF NOT EXISTS (SELECT 1 FROM TipoMuestraNormas WHERE IdTipoMuestra = 3 AND IdNorma = 1)
    INSERT INTO TipoMuestraNormas (IdTipoMuestra, IdNorma) VALUES (3, 1);
GO

USE [master]
GO
ALTER DATABASE [LaboratorioControlCalidad] SET  READ_WRITE 
GO
