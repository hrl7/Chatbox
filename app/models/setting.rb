class Setting < ActiveRecord::Base
  belongs_to :user
  enum post_method: [:enter, :meta_enter]
end
