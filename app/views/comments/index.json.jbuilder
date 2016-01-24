json.array!(@comments) do |comment|
  json.extract! comment, :id, :user_id, :body, :attach, :created_at
  json.(comment.user, :name, :avatar)
  json.url comment_url(comment, format: :json)
end
