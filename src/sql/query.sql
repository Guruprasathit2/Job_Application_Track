create table tbl_user(
    id SERIAL primary key,
    user_name varchar(50),
    email_id varchar(50),
    password varchar(100),
    otp varchar(10),
    otp_expiry timestamp,
    phone_number varchar(20),
    role_id int,
    company_id int,
    canidate_type varchar(50),
    address varchar(200),
    file_path varchar(100),
    file_name varchar(100),
    date_of_birth varchar(20),
    is_active int default 0,
    created_by int,
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    modified_by int,
    modified_date timestamp
);

create table tbl_staff_details(
    id serial primary key,
    staff_id int,
    office_number varchar(20),
    degination varchar(60),
    department varchar(50),
    experience varchar(50)
);

create table tbl_user_token(
    id serial primary key,
    token varchar(600),
    user_id int,
    created_date timestamp DEFAULT CURRENT_TIMESTAMP
);

create table tbl_login_audit_log(
    id serial primary key,
    user_id int,
    login_time timestamp,
    logout_time timestamp
);

create table tbl_experience(
    id serial primary key,
    user_id int,
    company_name varchar(50),
    role varchar(50),
    start_date timestamp,
    end_date timestamp,
    created_by int,
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    modified_by int,
    modified_date timestamp
);

create table tbl_education(
    id serial primary key,
    user_id int,
    college_name varchar(60),
    start_date timestamp,
    end_date timestamp,
    course varchar(40),
    score varchar(10),
    created_by int,
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    modified_by int,
    modified_date timestamp
);

create table tbl_role(
    id SERIAL primary key,
    role_name varchar(20),
    role_slug varchar(20),
    is_active int default 0,
    created_by int,
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    modified_by int,
    modified_date timestamp
);

create table tbl_company(
    id serial primary key,
    company_name varchar(50),
    short_name varchar(50),
    company_email varchar(20),
    company_address varchar(500),
    website varchar(200),
    company_location varchar(100),
    industry_type varchar(100),
    linkdin_link varchar(300),
    logo varchar(1000),
    is_active int default 0,
    is_delete int default 0,
    created_by int,
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    modified_by int,
    modified_date timestamp
);

create table tbl_job(
    id serial primary key,
    company_id int,
    role_name varchar(100),
    description varchar(1000),
    skill_id varchar(500),
    no_of_application int,
    is_active int default 0,
    is_delete int default 0,
    created_by int,
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    modified_by int,
    modified_date timestamp
);

create table tbl_job_skill(
    id serial primary key,
    skill varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP
);

create table tbl_job_applied(
    id SERIAL primary key,
    job_id varchar(100),
    status varchar(10),
    reason varchar(100),
    created_by int,
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    modified_by int,
    modified_date timestamp
);

INSERT INTO tbl_role(role_name, role_slug, is_active, created_date)
VALUES
('Admin', 'admin', 1, CURRENT_DATE),
('Staff', 'staff', 1, CURRENT_DATE),
('Candidate', 'candidate', 1, CURRENT_DATE);