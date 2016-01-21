json.array!(@comments) do |comment|
  json.extract! comment, :id, :user_id, :body, :attach
  json.url comment_url(comment, format: :json)
end
