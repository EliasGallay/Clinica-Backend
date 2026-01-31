/*==============================================================*/
/* Table: USERS                                                 */
/*==============================================================*/
create table USERS (
   USR_IDT_ID           SERIAL not null,
   LOC_IDT_ID           INT2                 not null,
   USR_TXT_NAME         VARCHAR(50)          not null,
   USR_TXT_LASTNAME     VARCHAR(50)          not null,
   USR_TXT_DNI          VARCHAR(10)          not null,
   USR_DAT_DATEOFBIRTH  DATE                 not null,
   USR_INT_GENDER       SMALLINT             not null,
   USR_TXT_CELPHONE     VARCHAR(20)          null,
   USR_TXT_CUIT_CUIL    VARCHAR(11)          not null,
   USR_TXT_EMAIL        VARCHAR(50)          not null,
   USR_TXT_STREETNAME   VARCHAR(50)          not null,
   USR_TXT_STREETNUMBER VARCHAR(4)           not null,
   USR_TXT_FLOOR        VARCHAR(2)           null,
   USR_TXT_DEPARTMENT   VARCHAR(4)           null,
   USR_TXT_PostalCODE   VARCHAR(10)          not null,
   USR_INT_ROL          SMALLINT             not null,
   USR_DAT_REGISTRATIONDATE TIMESTAMP        not null,
   USR_INT_REGISTERORIGIN INT2               not null,
   USR_TXT_REGISTERORIGINHASH VARCHAR(50)    null,
   USR_DAT_TERMINATIONDATE TIMESTAMP         null,
   USR_INT_IMAGE        INT4                 null,
   USR_TXT_PASSWORD     VARCHAR(100)         null,
   USR_TXT_TOKEN        VARCHAR(250)         null,
   USR_STA_STATE        SMALLINT             not null,
   USR_STA_EMPLOYEE_STATE SMALLINT           not null,
   USR_TXT_VERIFICATION_CODE VARCHAR(6)      null,
   DATE_DELETED_AT      TIMESTAMP            null,
   USR_TXT_IMAGE_EXT    VARCHAR(100)         null,
   constraint PK_USERS primary key (USR_IDT_ID)
);
