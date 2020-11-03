/* eslint-disable no-unused-vars */
import Knex from 'knex'

export async function up (knex: Knex) {
  return knex.schema.createTable('service', table => {
    table.increments('id').primary()
    table.string('description')
    table.string('name').notNullable()
    table.string('cover', 1000)
    table.string('notes')
    table.string('status')
    table.integer('category_id').references('id')
      .inTable('category').notNullable().unsigned()
  })
}

export async function down (knex: Knex) {
  return knex.schema.dropTable('service')
}