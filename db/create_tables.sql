-- Drop existing tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS "ProductBadges" CASCADE;
DROP TABLE IF EXISTS "BadgesTranslations" CASCADE;
DROP TABLE IF EXISTS "ProductsTranslations" CASCADE;
DROP TABLE IF EXISTS "PaymentMethodsTranslations" CASCADE;
DROP TABLE IF EXISTS "MenuItemPrices" CASCADE;
DROP TABLE IF EXISTS "MenuItemLayout" CASCADE;
DROP TABLE IF EXISTS "MenuGroups" CASCADE;
DROP TABLE IF EXISTS "MenuGroupsTranslations" CASCADE;
DROP TABLE IF EXISTS "SettingsTemplateBanners" CASCADE;
DROP TABLE IF EXISTS "SettingsTemplateLanguages" CASCADE;
DROP TABLE IF EXISTS "BranchSettingsTemplates" CASCADE;
DROP TABLE IF EXISTS "SettingsTemplates" CASCADE;
DROP TABLE IF EXISTS "Branches" CASCADE;
DROP TABLE IF EXISTS "MenuTemplates" CASCADE;
DROP TABLE IF EXISTS "PriceTemplates" CASCADE;
DROP TABLE IF EXISTS "PaymentMethods" CASCADE;
DROP TABLE IF EXISTS "Products" CASCADE;
DROP TABLE IF EXISTS "Badges" CASCADE;
DROP TABLE IF EXISTS "Languages" CASCADE;
DROP TABLE IF EXISTS "ComboHeaders" CASCADE;
DROP TABLE IF EXISTS "ComboGroups" CASCADE;
DROP TABLE IF EXISTS "ComboTranslations" CASCADE;
DROP TABLE IF EXISTS "ComboDetails" CASCADE;
DROP TABLE IF EXISTS "ProductsExtends" CASCADE;

-- Create Tables for PostgreSQL

-- Languages Table
CREATE TABLE "Languages" (
    "Key" uuid NOT NULL,
    "Code" character varying(2),
    "Name" character varying(50),
    "Dir" character varying(3),
    "IsActive" boolean DEFAULT true,
    "DisplayOrderId" integer NOT NULL,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Languages_pkey" PRIMARY KEY ("Key"),
    CONSTRAINT "Languages_Code_key" UNIQUE ("Code")
);

-- Badges Table
CREATE TABLE "Badges" (
    "BadgeKey" uuid,
    "Code" character varying(50),
    "IsActive" boolean DEFAULT true,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Badges_pkey" PRIMARY KEY ("BadgeKey"),
    CONSTRAINT "Badges_Code_key" UNIQUE ("Code")
);

-- BadgesTranslations Table
CREATE TABLE "BadgesTranslations" (
    "BadgeKey" uuid,
    "LanguageKey" uuid,
    "Name" character varying(100),
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_BadgesTranslations" PRIMARY KEY ("BadgeKey", "LanguageKey")
);

-- Products Table (Modified to use UUID)
CREATE TABLE "Products" (
    "ProductKey" uuid,
    "ProductCode" VARCHAR(50),
    "ExternalCode" VARCHAR(50),
    "ProductName" VARCHAR(255),
    "ECommerceProductName1" VARCHAR(255),
    "GroupID" INTEGER,
    "CategoryID" INTEGER,
    "CategoryName" VARCHAR(255),
    "GroupName" VARCHAR(255),
    "TaxGroupID" INTEGER,
    "TaxPercent" DECIMAL(5,2) DEFAULT 8.0,
    "ImageUrl" VARCHAR(255),
    "Barcode" VARCHAR(50),
    "Barcode2" VARCHAR(50),
    "Barcode3" VARCHAR(50),
    "Barcode4" VARCHAR(50),
    "Barcode5" VARCHAR(50),
    "Barcode6" VARCHAR(50),
    "Barcode7" VARCHAR(50),
    "Barcode8" VARCHAR(50),
    "Barcode9" VARCHAR(50),
    "Barcode10" VARCHAR(50),
    "OrderByWeight" BOOLEAN DEFAULT FALSE,
    "ComboKey" uuid,
    "IsCombo" BOOLEAN DEFAULT FALSE,
    "IsActive" BOOLEAN DEFAULT true,
    "IsSaleProduct" BOOLEAN DEFAULT true,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Products_pkey" PRIMARY KEY ("ProductKey")
);

-- ProductsTranslations Table
CREATE TABLE "ProductsTranslations" (
    "ProductKey" uuid,
    "LanguageKey" uuid,
    "Name" character varying(255),
    "Description" text,
    "ImageUrl" VARCHAR(255),
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP

);

-- ProductBadges Table
CREATE TABLE "ProductBadges" (
    "ProductKey" uuid,
    "BadgeKey" uuid,
    "IsActive" boolean DEFAULT true,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_ProductBadges" PRIMARY KEY ("ProductKey", "BadgeKey")
);

-- ProductsExtends Table
CREATE TABLE "ProductsExtends" (
    "ProductKey" uuid NOT NULL,
    "GroupID" INTEGER NOT NULL,
    "CategoryID" INTEGER NOT NULL,
    "ProductCode" VARCHAR(50) NOT NULL,
    "PreparationTime" INTEGER,
    "Weight" INTEGER,
    "Calories" INTEGER,
    "Rating" DECIMAL(3,1),
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductsExtends_pkey" PRIMARY KEY ("ProductKey", "GroupID", "CategoryID", "ProductCode"),
    CONSTRAINT "check_rating_range" CHECK ("Rating" >= 0.0 AND "Rating" <= 5.0)
);

-- Branches Table
CREATE TABLE "Branches" (
    "BranchID" SERIAL PRIMARY KEY,
    "BranchName" VARCHAR(255),
    "KioskMenuTemplateKey" uuid,
    "PriceTemplateKey" uuid,
    "IsActive" BOOLEAN DEFAULT true,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- SettingsTemplates Table
CREATE TABLE "SettingsTemplates" (
    "TemplateKey" uuid PRIMARY KEY,
    "TemplateName" VARCHAR(255),
    "MainColor" VARCHAR(10),
    "SecondColor" VARCHAR(10),
    "AccentColor" VARCHAR(10),
    "DefaultLanguageKey" uuid,
    "LogoUrl" VARCHAR(255),
    "IsActive" BOOLEAN DEFAULT true,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_SettingsTemplates_Languages" FOREIGN KEY ("DefaultLanguageKey")
        REFERENCES "Languages" ("Key") ON DELETE SET NULL
);

-- BranchSettingsTemplates Table
CREATE TABLE "BranchSettingsTemplates" (
    "BranchID" INTEGER,
    "TemplateKey" uuid,
    "IsActive" BOOLEAN DEFAULT true,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_BranchSettingsTemplates" PRIMARY KEY ("BranchID", "TemplateKey"),
    CONSTRAINT "FK_BranchSettingsTemplates_Template" FOREIGN KEY ("TemplateKey")
        REFERENCES "SettingsTemplates" ("TemplateKey") ON DELETE CASCADE
);

-- SettingsTemplateBanners Table
CREATE TABLE "SettingsTemplateBanners" (
    "BannerID" SERIAL,
    "TemplateKey" uuid,
    "BannerUrl" VARCHAR(255),
    "DisplayOrder" INTEGER,
    "IsActive" BOOLEAN DEFAULT true,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_SettingsTemplateBanners" PRIMARY KEY ("BannerID"),
    CONSTRAINT "FK_SettingsTemplateBanners_Template" FOREIGN KEY ("TemplateKey")
        REFERENCES "SettingsTemplates" ("TemplateKey") ON DELETE CASCADE
);

-- SettingsTemplateLanguages Table
CREATE TABLE "SettingsTemplateLanguages" (
    "TemplateKey" uuid,
    "LanguageKey" uuid,
    "IsActive" BOOLEAN DEFAULT true,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_SettingsTemplateLanguages" PRIMARY KEY ("TemplateKey", "LanguageKey"),
    CONSTRAINT "FK_SettingsTemplateLanguages_Template" FOREIGN KEY ("TemplateKey")
        REFERENCES "SettingsTemplates" ("TemplateKey") ON DELETE CASCADE,
    CONSTRAINT "FK_SettingsTemplateLanguages_Languages" FOREIGN KEY ("LanguageKey")
        REFERENCES "Languages" ("Key") ON DELETE CASCADE
);

-- MenuTemplates Table
CREATE TABLE "MenuTemplates" (
    "TemplateKey" uuid PRIMARY KEY,
    "TemplateName" VARCHAR(255),
    "TemplateMode" INTEGER,
    "IsActive" BOOLEAN DEFAULT true,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- MenuGroups Table
CREATE TABLE "MenuGroups" (
    "TemplateKey" uuid,
    "MenuGroupKey" uuid PRIMARY KEY,
    "MenuGroupText" VARCHAR(255),
    "DisplayIndex" INTEGER,
    "MenuGroupActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- MenuGroupsTranslations Table
CREATE TABLE "MenuGroupsTranslations" (
    "MenuGroupKey" uuid,
    "LanguageKey" uuid,
    "Name" character varying(255),
    "Description" text,
    "ImageUrl" VARCHAR(255),
    "DisplayIndex" INTEGER DEFAULT 0,
    "IsActive" BOOLEAN DEFAULT true,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_MenuGroupsTranslations" PRIMARY KEY ("MenuGroupKey", "LanguageKey"),
    CONSTRAINT "FK_MenuGroupsTranslations_Languages" FOREIGN KEY ("LanguageKey")
        REFERENCES "Languages" ("Key") ON DELETE CASCADE
);

-- MenuItemLayout Table
CREATE TABLE "MenuItemLayout" (
    "TemplateKey" uuid,
    "MenuGroupKey" uuid,
    "MainMenuItemKey" uuid,
    "MenuItemKey" uuid,
    "ComboKey" uuid,
    "IsTopMenu" BOOLEAN DEFAULT FALSE,
    "DisplayIndex" INTEGER,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- PriceTemplates Table
CREATE TABLE "PriceTemplates" (
    "PriceTemplateKey" uuid PRIMARY KEY,
    "PriceTemplateName" VARCHAR(255),
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- MenuItemPrices Table
CREATE TABLE "MenuItemPrices" (
    "PriceTemplateKey" uuid,
    "MenuItemKey" uuid,
    "TakeOutPrice_TL" DECIMAL(10,2),
    "TakeOutPrice_USD" DECIMAL(10,2),
    "TakeOutPrice_EUR" DECIMAL(10,2),
    "TakeOutPrice_GBP" DECIMAL(10,2),
    "DeliveryPrice_TL" DECIMAL(10,2),
    "DeliveryPrice_USD" DECIMAL(10,2),
    "DeliveryPrice_EUR" DECIMAL(10,2),
    "DeliveryPrice_GBP" DECIMAL(10,2),
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("PriceTemplateKey", "MenuItemKey")
);

-- PaymentMethods Table
CREATE TABLE "PaymentMethods" (
    "PaymentMethodKey" uuid PRIMARY KEY,
    "PaymentMethodID" INTEGER,
    "PaymentName" VARCHAR(255),
    "Type" VARCHAR(50),
    "Name" VARCHAR(255),
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- PaymentMethodsTranslations Table
CREATE TABLE "PaymentMethodsTranslations" (
    "PaymentMethodKey" uuid,
    "LanguageKey" uuid,
    "Name" character varying(255),
    "Description" text,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_PaymentMethodsTranslations" PRIMARY KEY ("PaymentMethodKey", "LanguageKey"),
    CONSTRAINT "FK_PaymentMethodsTranslations_PaymentMethods" FOREIGN KEY ("PaymentMethodKey")
        REFERENCES "PaymentMethods" ("PaymentMethodKey") ON DELETE CASCADE,
    CONSTRAINT "FK_PaymentMethodsTranslations_Languages" FOREIGN KEY ("LanguageKey")
        REFERENCES "Languages" ("Key") ON DELETE CASCADE
);

-- Combo Tables
CREATE TABLE "ComboHeaders" (
    "ComboKey" uuid,
    "ComboName" VARCHAR(255),
    "BranchID" INTEGER DEFAULT 0,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("ComboKey", "BranchID")
);

CREATE TABLE "ComboGroups" (
    "ComboKey" uuid,
    "BranchID" INTEGER DEFAULT 0,
    "GroupName" VARCHAR(255),
    "SubGroupName" VARCHAR(255),
    "GroupOrderID" INTEGER,
    "ForcedQuantity" INTEGER DEFAULT 0,
    "MaxQuantity" INTEGER DEFAULT 0,
    "IsForcedGroup" BOOLEAN DEFAULT FALSE,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_ComboGroups_ComboHeaders" FOREIGN KEY ("ComboKey", "BranchID") 
        REFERENCES "ComboHeaders" ("ComboKey", "BranchID") ON DELETE CASCADE
);

CREATE TABLE "ComboTranslations" (
    "ComboKey" uuid,
    "LanguageKey" uuid,
    "Name" character varying(255),
    "GroupName" character varying(255),
    "Description" text,
    "ImageUrl" VARCHAR(255),
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_ComboTranslations" PRIMARY KEY ("ComboKey", "LanguageKey"),
    CONSTRAINT "FK_ComboTranslations_Languages" FOREIGN KEY ("LanguageKey")
        REFERENCES "Languages" ("Key") ON DELETE CASCADE
);

CREATE TABLE "ComboDetails" (
    "ComboKey" uuid,
    "BranchID" INTEGER DEFAULT 0,
    "GroupName" VARCHAR(255),
    "SubGroupName" VARCHAR(255),
    "ProductKey" uuid,
    "DefaultQuantity" INTEGER DEFAULT 0,
    "ExtraPriceTakeOut_TL" DECIMAL(10,2) DEFAULT 0,
    "ExtraPriceTakeOut_USD" DECIMAL(10,2) DEFAULT 0,
    "ExtraPriceTakeOut_EUR" DECIMAL(10,2) DEFAULT 0,
    "ExtraPriceTakeOut_GBP" DECIMAL(10,2) DEFAULT 0,
    "ExtraPriceDelivery_TL" DECIMAL(10,2) DEFAULT 0,
    "ExtraPriceDelivery_USD" DECIMAL(10,2) DEFAULT 0,
    "ExtraPriceDelivery_EUR" DECIMAL(10,2) DEFAULT 0,
    "ExtraPriceDelivery_GBP" DECIMAL(10,2) DEFAULT 0,
    "IsDefault" BOOLEAN DEFAULT FALSE,
    "ScreenOrderID" INTEGER,
    "CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_ComboDetails_Products" FOREIGN KEY ("ProductKey") 
        REFERENCES "Products" ("ProductKey") ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX idx_branches_kiosk_template ON "Branches" ("KioskMenuTemplateKey");
CREATE INDEX idx_branches_price_template ON "Branches" ("PriceTemplateKey");
CREATE INDEX idx_settings_templates_default_language ON "SettingsTemplates" ("DefaultLanguageKey");
CREATE INDEX idx_branch_settings_templates_branch ON "BranchSettingsTemplates" ("BranchID");
CREATE INDEX idx_branch_settings_templates_template ON "BranchSettingsTemplates" ("TemplateKey");
CREATE INDEX idx_settings_template_banners_template ON "SettingsTemplateBanners" ("TemplateKey");
CREATE INDEX idx_settings_template_languages_template ON "SettingsTemplateLanguages" ("TemplateKey");
CREATE INDEX idx_settings_template_languages_language ON "SettingsTemplateLanguages" ("LanguageKey");
CREATE INDEX idx_menu_groups_template ON "MenuGroups" ("TemplateKey");
CREATE INDEX idx_menu_layout_template ON "MenuItemLayout" ("TemplateKey");
CREATE INDEX idx_menu_layout_group ON "MenuItemLayout" ("MenuGroupKey");
CREATE INDEX idx_menu_item_prices_template ON "MenuItemPrices" ("PriceTemplateKey");
CREATE INDEX idx_payment_types_type ON "PaymentMethods" ("Type");
CREATE INDEX idx_products_combo ON "Products" ("ComboKey");
CREATE INDEX idx_badge_translations_language ON "BadgesTranslations" ("LanguageKey");
CREATE INDEX idx_product_translations_language ON "ProductsTranslations" ("LanguageKey");
CREATE INDEX idx_product_badges_badge ON "ProductBadges" ("BadgeKey");
CREATE INDEX idx_payment_types_translations_language ON "PaymentMethodsTranslations" ("LanguageKey");
CREATE INDEX idx_menu_groups_translations_language ON "MenuGroupsTranslations" ("LanguageKey");
CREATE INDEX idx_combo_headers_branch ON "ComboHeaders" ("BranchID");
CREATE INDEX idx_combo_groups_combo ON "ComboGroups" ("ComboKey");
CREATE INDEX idx_combo_details_combo ON "ComboDetails" ("ComboKey");
CREATE INDEX idx_combo_details_product ON "ComboDetails" ("ProductKey");
CREATE INDEX idx_combo_translations_language ON "ComboTranslations" ("LanguageKey");
CREATE INDEX idx_combo_translations_combo ON "ComboTranslations" ("ComboKey");
CREATE INDEX idx_products_extends_product ON "ProductsExtends" ("ProductKey");
CREATE INDEX idx_products_extends_group ON "ProductsExtends" ("GroupID");
CREATE INDEX idx_products_extends_category ON "ProductsExtends" ("CategoryID");
CREATE INDEX idx_products_extends_code ON "ProductsExtends" ("ProductCode");

-- Add Foreign Keys
ALTER TABLE "Branches"
    ADD CONSTRAINT fk_branches_menu_template FOREIGN KEY ("KioskMenuTemplateKey") REFERENCES "MenuTemplates" ("TemplateKey"),
    ADD CONSTRAINT fk_branches_price_template FOREIGN KEY ("PriceTemplateKey") REFERENCES "PriceTemplates" ("PriceTemplateKey");

ALTER TABLE "MenuGroups"
    ADD CONSTRAINT fk_menu_groups_template FOREIGN KEY ("TemplateKey") REFERENCES "MenuTemplates" ("TemplateKey");

ALTER TABLE "MenuItemLayout"
    ADD CONSTRAINT fk_menu_layout_template FOREIGN KEY ("TemplateKey") REFERENCES "MenuTemplates" ("TemplateKey"),
    ADD CONSTRAINT fk_menu_layout_group FOREIGN KEY ("MenuGroupKey") REFERENCES "MenuGroups" ("MenuGroupKey"),
    ADD CONSTRAINT fk_menu_layout_product FOREIGN KEY ("MenuItemKey") REFERENCES "Products" ("ProductKey");

ALTER TABLE "MenuItemPrices"
    ADD CONSTRAINT fk_menu_item_prices_template FOREIGN KEY ("PriceTemplateKey") REFERENCES "PriceTemplates" ("PriceTemplateKey"),
    ADD CONSTRAINT fk_menu_item_prices_product FOREIGN KEY ("MenuItemKey") REFERENCES "Products" ("ProductKey");

ALTER TABLE "BadgesTranslations"
    ADD CONSTRAINT "FK_BadgesTranslations_Badges" FOREIGN KEY ("BadgeKey")
        REFERENCES "Badges" ("BadgeKey") ON DELETE CASCADE,
    ADD CONSTRAINT "FK_BadgesTranslations_Languages" FOREIGN KEY ("LanguageKey")
        REFERENCES "Languages" ("Key") ON DELETE CASCADE;

ALTER TABLE "ProductBadges"
    ADD CONSTRAINT "FK_ProductBadges_Badges" FOREIGN KEY ("BadgeKey")
        REFERENCES "Badges" ("BadgeKey") ON DELETE CASCADE;


-- Insert Language Data
INSERT INTO "Languages" ("Key", "Code", "Name", "IsActive", "Dir", "DisplayOrderId") VALUES
('550e8400-e29b-41d4-a716-446655440010', 'TR', 'Türkçe', true, 'ltr', 1),
('550e8400-e29b-41d4-a716-446655440011', 'AZ', 'Azərbaycan',true, 'ltr', 2),
('550e8400-e29b-41d4-a716-446655440012', 'GB', 'English', true, 'ltr', 3),
('550e8400-e29b-41d4-a716-446655440013', 'SA', 'العربية', true, 'rtl', 4),
('550e8400-e29b-41d4-a716-446655440014', 'RU', 'Русский', true, 'ltr', 5);

-- Insert Badge Data
INSERT INTO "Badges" ("BadgeKey", "Code", "IsActive") VALUES
('550e8400-e29b-41d4-a716-446655440000', 'SPICY', true),
('550e8400-e29b-41d4-a716-446655440001', 'VEGAN', true),
('550e8400-e29b-41d4-a716-446655440002', 'VEGETARIAN', true),
('550e8400-e29b-41d4-a716-446655440003', 'GLUTEN_FREE', true),
('550e8400-e29b-41d4-a716-446655440004', 'NEW', true),
('550e8400-e29b-41d4-a716-446655440005', 'BESTSELLER', true);

-- Insert Badge Translations
INSERT INTO "BadgesTranslations" ("BadgeKey", "LanguageKey", "Name") VALUES
-- Spicy translations
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'Acılı'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', 'Spicy'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', 'Acılı'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440014', 'Острый'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440013', 'حار'),

-- Vegan translations
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'Vegan'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', 'Vegan'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'Vegan'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', 'Веган'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440013', 'نباتي'),

-- Vegetarian translations
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'Vejetaryen'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', 'Vegetarian'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', 'Vegetarian'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', 'Вегетарианский'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440013', 'نباتي'),

-- Gluten Free translations
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440010', 'Glutensiz'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440012', 'Gluten Free'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440011', 'Glutensiz'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440014', 'Без глютена'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', 'خالي من الغلوتين'),

-- New translations
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440010', 'Yeni'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440012', 'New'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440011', 'Yeni'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440014', 'Новый'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440013', 'جديد'),

-- Bestseller translations
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440010', 'Çok Satan'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440012', 'Bestseller'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440011', 'Ən çox satılan'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440014', 'Бестселлер'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440013', 'الأكثر مبيعا');
