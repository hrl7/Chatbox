class SettingsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_setting
  def show

  end

  def edit
    
  end

  def update

    respond_to do |format|
      if @setting.update(setting_params)
        format.html { redirect_to settings_path, notice: 'Setting was successfully updated.' }
        format.json { render :show, status: :ok, location: @setting}
      else
        format.html { render :edit }
        format.json { render json: @setting.errors, status: :unprocessable_entity }
      end
    end
  end

  private 
  
    def set_setting
      @setting = Setting.find_or_create_by(:user => current_user) 
    end

    def setting_params
      params.require(:setting).permit(:name, :avatar, :post_method).merge(:user => current_user)
    end
end
