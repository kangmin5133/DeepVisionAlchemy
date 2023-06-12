SET FOREIGN_KEY_CHECKS=0;

use diva_db;

# system info
DROP TABLE if  exists `system_info`;
CREATE TABLE if not exists `system_info` (
  `version` varchar(32) NOT NULL,
  `name` varchar(100),
  `desc` varchar(512),
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`version`)
);

insert into system_info(`version`, `name`, `desc`, `created`, `updated` ) select 'v0.1', 'diva-db', 'diva database', DATE('2023-05-17'), DATE('2023-05-17');

# data_type table
DROP TABLE if  exists `data_type`;
CREATE TABLE `data_type` (
  `type_id` int NOT NULL,
  `type_name` varchar(32) NOT NULL,
  PRIMARY KEY (`type_id`)
) ;

# user_type table
DROP TABLE if  exists `user_type`;
CREATE TABLE `user_type` (
  `user_type_id` int NOT NULL,
  `type_name` varchar(32) NOT NULL,
  PRIMARY KEY (`user_type_id`)
) ;

# social_platform_type table
DROP TABLE if  exists `social_platform_type`;
CREATE TABLE `social_platform_type` (
  `provider_id` int NOT NULL,
  `provider_name` varchar(32) NOT NULL,
  PRIMARY KEY (`provider_id`)
) ;

# project_type table
DROP TABLE if  exists `project_type`;
CREATE TABLE `project_type` (
  `project_type_id` int NOT NULL,
  `type_name` varchar(32) NOT NULL,
  `desc` TEXT NULL DEFAULT NULL,

  PRIMARY KEY (`project_type_id`)
) ;

# role table
DROP TABLE if  exists `role`;
CREATE TABLE `role` (
  `role_id` int NOT NULL,
  `role_name` varchar(32) NOT NULL,
  `role_desc` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ;

# membership table
DROP TABLE if  exists `membership`;
CREATE TABLE `membership` (
  `membership_id` int NOT NULL,
  `membership_name` varchar(32) NOT NULL,
  PRIMARY KEY (`membership_id`)
) ;

# user table
DROP TABLE if  exists `user`;
CREATE TABLE if not exists `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_type_id` int NOT NULL,
  `user_pw` varchar(128) NULL,
  `social_id` varchar(128) NULL,
  `email` varchar(128) NOT NULL UNIQUE,
  `provider` int NULL,
  `name`	VARCHAR(32)	NULL,
  `membership_id`	int	NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`email`),
  CONSTRAINT `user_user_type_id_FK` FOREIGN KEY (`user_type_id`) REFERENCES `user_type` (`user_type_id`),
  CONSTRAINT `user_membership_id_FK` FOREIGN KEY (`membership_id`) REFERENCES `membership` (`membership_id`),
  CONSTRAINT `user_provider_FK` FOREIGN KEY (`provider`) REFERENCES `social_platform_type` (`provider_id`)
);

# organization table
DROP TABLE if  exists `organization`;
CREATE TABLE `organization` (
  `org_id` int NOT NULL AUTO_INCREMENT,
  `org_email` varchar(128)	NOT NULL,
  `org_name` varchar(32) NOT NULL,
  `creator_id` int NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`org_id`),
  CONSTRAINT `organization_creator_id_FK` FOREIGN KEY (`creator_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

# workspace table
DROP TABLE if  exists `workspace`;
CREATE TABLE `workspace` (
  `workspace_id` int NOT NULL AUTO_INCREMENT,
  `creator_id` int NOT NULL,
  `org_id` int NULL,
  `workspace_name` varchar(32) NOT NULL,
  `workspcae_info` varchar(128) NULL,
  `invitation_link` varchar(128) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`workspace_id`),
  CONSTRAINT `workspace_creator_id_FK` FOREIGN KEY (`creator_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `workspace_org_id_FK` FOREIGN KEY (`org_id`) REFERENCES `organization` (`org_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

# project table
DROP TABLE if  exists `project`;
CREATE TABLE `project` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `project_type` int NOT NULL,
  `project_name` varchar(32) NOT NULL,
  `desc` TEXT NULL DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  CONSTRAINT `project_project_type_FK` FOREIGN KEY (`project_type`) REFERENCES `project_type` (`project_type_id`)
  
) ;


# team table
DROP TABLE if  exists `team`;
CREATE TABLE `team` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `team_name` varchar(32) NOT NULL,
  `team_info` varchar(32) NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`team_id`)
) ;

# dataset table
DROP TABLE if  exists `dataset`;
CREATE TABLE `dataset` (
  `dataset_id` int NOT NULL AUTO_INCREMENT,
  `dataset_name` varchar(32) NOT NULL,
  `dataset_type` varchar(32) NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`dataset_id`),
  CONSTRAINT `dataset_data_type_FK` FOREIGN KEY (`data_type`) REFERENCES `data_type` (`type_id`)
) ;

# dataset_project table
DROP TABLE if  exists `dataset_project`;
CREATE TABLE `dataset_project` (
  `project_id` int NOT NULL,
  `dataset_id` int NOT NULL,
  PRIMARY KEY (`project_id`,`dataset_id`),
  CONSTRAINT `dataset_project_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dataset_project_dataset_id_FK` FOREIGN KEY (`dataset_id`) REFERENCES `dataset` (`dataset_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

# workspace_teams table
DROP TABLE if  exists `workspace_teams`;
CREATE TABLE `workspace_teams` (
  `workspace_id` int NOT NULL,
  `team_id` int NOT NULL,
  PRIMARY KEY (`workspace_id`,`team_id`),
  CONSTRAINT `workspace_teams_workspace_id_FK` FOREIGN KEY (`workspace_id`) REFERENCES `workspace` (`workspace_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `workspace_teams_team_id_FK` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

# user_teams table
DROP TABLE if  exists `user_teams`;
CREATE TABLE `user_teams` (
  `user_id` int NOT NULL,
  `team_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`team_id`),
  CONSTRAINT `user_teams_user_id_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_teams_team_id_FK` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

# team_projects table
DROP TABLE if  exists `team_projects`;
CREATE TABLE `team_projects` (
  `team_id` int NOT NULL,
  `project_id` int NOT NULL,
  PRIMARY KEY (`team_id`,`project_id`),
  CONSTRAINT `team_projects_team_id_FK` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `team_projectsproject_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

# user_project_roles table
DROP TABLE if  exists `user_project_roles`;
CREATE TABLE `user_project_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `project_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`,`project_id`),
  CONSTRAINT `user_project_roles_user_id_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_project_roles_role_id_FK` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_project_roles_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

# user_organization table
DROP TABLE if  exists `user_organization`;
CREATE TABLE `user_organization` (
  `user_id` int NOT NULL,
  `org_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`org_id`),
  CONSTRAINT `user_organization_user_id_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_organization_org_id_FK` FOREIGN KEY (`org_id`) REFERENCES `organization` (`org_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;
