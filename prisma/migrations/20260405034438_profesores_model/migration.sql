-- CreateTable
CREATE TABLE `profesores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `employee_id` VARCHAR(10) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
