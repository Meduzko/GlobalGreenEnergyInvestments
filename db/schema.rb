# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150509191358) do

  create_table "admin_users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "admin_users", ["email"], name: "index_admin_users_on_email", unique: true, using: :btree
  add_index "admin_users", ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true, using: :btree

  create_table "amortizations", force: :cascade do |t|
    t.integer  "project_id", limit: 4
    t.string   "csv_name",   limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "ckeditor_assets", force: :cascade do |t|
    t.string   "data_file_name",    limit: 255, null: false
    t.string   "data_content_type", limit: 255
    t.integer  "data_file_size",    limit: 4
    t.integer  "assetable_id",      limit: 4
    t.string   "assetable_type",    limit: 30
    t.string   "type",              limit: 30
    t.integer  "width",             limit: 4
    t.integer  "height",            limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ckeditor_assets", ["assetable_type", "assetable_id"], name: "idx_ckeditor_assetable", using: :btree
  add_index "ckeditor_assets", ["assetable_type", "type", "assetable_id"], name: "idx_ckeditor_assetable_type", using: :btree

  create_table "page_tabs", force: :cascade do |t|
    t.integer  "page_id",     limit: 4
    t.string   "tab_name",    limit: 255
    t.integer  "position",    limit: 4,     default: 1
    t.text     "description", limit: 65535
    t.boolean  "status",      limit: 1,     default: false
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
  end

  create_table "pages", force: :cascade do |t|
    t.string   "name",       limit: 255,                 null: false
    t.string   "slug",       limit: 255
    t.boolean  "status",     limit: 1,   default: false
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
  end

  add_index "pages", ["slug"], name: "index_pages_on_slug", unique: true, using: :btree

  create_table "profiles", force: :cascade do |t|
    t.integer  "user_id",           limit: 4
    t.string   "phone",             limit: 255
    t.date     "date_of_birthday"
    t.string   "country",           limit: 255
    t.string   "address_street",    limit: 255
    t.string   "address_num_house", limit: 255
    t.string   "address_city",      limit: 255
    t.integer  "adress_zip_code",   limit: 4
    t.string   "bank_account_name", limit: 255
    t.string   "bank_iban_code",    limit: 255
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  create_table "projects", force: :cascade do |t|
    t.string   "name",                  limit: 255
    t.string   "title",                 limit: 255
    t.string   "location",              limit: 255
    t.string   "small_foto",            limit: 255
    t.string   "big_foto",              limit: 255
    t.string   "type_of_participation", limit: 255
    t.string   "type_of_energe",        limit: 255
    t.integer  "total_amount_need",     limit: 4
    t.integer  "total_amount_invested", limit: 4
    t.float    "irr",                   limit: 24
    t.text     "desc_1",                limit: 65535
    t.string   "img_1",                 limit: 255
    t.text     "desc_2",                limit: 65535
    t.string   "img_2",                 limit: 255
    t.text     "desc_3",                limit: 65535
    t.string   "img_3",                 limit: 255
    t.text     "desc_4",                limit: 65535
    t.string   "img_4",                 limit: 255
    t.text     "desc_5",                limit: 65535
    t.string   "img_5",                 limit: 255
    t.boolean  "launch",                limit: 1
    t.float    "kwh_generated",         limit: 24
    t.boolean  "status",                limit: 1
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  create_table "rich_rich_files", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "rich_file_file_name",    limit: 255
    t.string   "rich_file_content_type", limit: 255
    t.integer  "rich_file_file_size",    limit: 4
    t.datetime "rich_file_updated_at"
    t.string   "owner_type",             limit: 255
    t.integer  "owner_id",               limit: 4
    t.text     "uri_cache",              limit: 65535
    t.string   "simplified_type",        limit: 255,   default: "file"
  end

  create_table "subscribes", force: :cascade do |t|
    t.string   "name",          limit: 255
    t.string   "email",         limit: 255
    t.string   "confirm_token", limit: 255
    t.boolean  "confirmed",     limit: 1,   default: false
    t.boolean  "active",        limit: 1,   default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "first_name",             limit: 255
    t.string   "last_name",              limit: 255
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
