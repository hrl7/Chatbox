class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|
      t.references :user, index: true, foreign_key: true
      t.string :name
      t.string :avatar
      t.integer:post_method

      t.timestamps null: false
    end
  end
end
