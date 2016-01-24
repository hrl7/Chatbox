# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'ChatBox'
set :repo_url, 'git@github.com:hrl7/chatbox.git'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/var/www/html/ops/chatbox'

# Default value for :scm is :git
set :scm, :git

# Default value for :format is :pretty
set :format, :pretty

# Default value for :log_level is :debug
set :log_level, :debug

# Default value for :pty is false
set :pty, true

# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml', 'db/production.sqlite3')

# Default value for linked_dirs is []
# Default value for default_env is {}
set :linked_dirs, %w{public/uploads}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }
set :default_env , {
  rbenv_root: "/home/ops/.rbenv",
  rails_chlib_host: "chatbox.horol.org",
  path: "/usr/local/rbenv/bin/shims:/usr/local/rbenv/bin:$PATH"
}

# Default value for keep_releases is 5
# set :keep_releases, 5
set :nc_terminal, 'com.googlecode.iterm2'
set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} /usr/local/rbenv/bin/rbenv exec"
set :rbenv_map_bins, %w{rake gem bundle ruby rails}
set :rbenv_roles, :all # default value
set :rbenv_ruby, '2.2.2'

set :keep_releases, 5
set :passenger_roles, :app
set :passenger_restart_runner, :sequence
set :passenger_restart_wait, 5
set :passenger_restart_limit, 2
set :passenger_restart_with_sudo, false
set :passenger_environment_variables, {}
set :passenger_restart_command, 'passenger-config restart-app'
set :passenger_restart_options, -> { "#{deploy_to} --ignore-app-not-running" }

namespace :deploy do

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

end
