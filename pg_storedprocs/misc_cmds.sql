--   these are various commands and info for working with postgres. These should NOT
-- be run as a stored procedure. Instead, copy the snippet of interest into a SQL
-- prompt/query window and execute


---------------------------------------------------------------------------------------------
-- SEQUENCES - creating them, linking to a table, setting up auto-increment

-- normally, when createing a table, use the SERIAL term
CREATE TABLE foo (ID BIGSERIAL PRIMARY KEY NOT NULL,  otherfld varchar(50), othernum INTEGER)

-- but if table already has data, need to create sequence, set the start, alter the table
select max(id) from mytable -- note the value - say it is 27
CREATE SEQUENCE mytable_id_seq start 27 INCREMENT BY 1 OWNED BY mytable.id
alter table mytable alter column id primary key not null set default nextval('mytable_id_seq') -- may not need PRIMARY if already done



