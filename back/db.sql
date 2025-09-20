create database SmartFlow;
use SmartFlow;

-- Usuários
create table usuarios (
    email varchar(255) not null primary key,
    nome varchar(255) not null,
    nasc date not null,
    senha varchar(255) not null  -- senha maior para hash
);

-- Turmas
create table turma (
    nome_turma varchar(255) not null primary key
);

-- Professores
create table professores (
    email_prof varchar(255) not null,
    materia varchar(255) not null,
    nome_turma varchar(255),
    foreign key (email_prof) references usuarios(email),
    foreign key (nome_turma) references turma(nome_turma)
);

-- Alunos
create table alunos (
    email_aluno varchar(255) not null,
    nome_turma varchar(255),
    foreign key (email_aluno) references usuarios(email),
    foreign key (nome_turma) references turma(nome_turma)
);

-- Presenças 
create table presencas (
    email_aluno varchar(255) not null,
    data_aula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    presente boolean not null, -- TRUE = presente, FALSE = falta
    primary key (email_aluno, data_aula),
    foreign key (email_aluno) references alunos(email_aluno)
);

-- Avaliações
create table avaliacoes (
    email_aluno varchar(255) not null,
    trimestre int not null,          -- 1, 2 ou 3
    nota1 decimal(5,2),
    nota2 decimal(5,2),
    media decimal(5,2),
    primary key (email_aluno, trimestre),
    foreign key (email_aluno) references alunos(email_aluno)
);

-- Exemplo de insert
insert into usuarios (email, nome, nasc, senha)
values ('bruna@SFadm.com.br','Bruna','1995-10-20','12345');

insert into turma (nome_turma) value ('3B');
select * from turma;
