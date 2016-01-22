json.array!(@comments) do |comment|
  json.extract! comment, :id, :user_id, :body, :attach, :created_at
  json.(current_user, :name, :avatar)
  json.url comment_url(comment, format: :json)
end
