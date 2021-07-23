class GroupUserController < ApplicationController
  def new
    @group = Group.find_by(id: params[:group_id])
  end

  def create
    @group_user = GroupUser.new(group_user_parameters)
    if @group_user.save
      flash[:danger] = "招待しました！#{group_user_parameters}  #{params[:group_id]}"
      redirect_to Group.find_by(id: params[:group_id])
    else
      flash[:danger] = "招待できませんでした！#{group_user_parameters}"
      redirect_to Group.find_by(id: params[:group_id])
    end
  end

  def destroy
    @group_user = GroupUser.find_by(group_user_parameters)
    if @group_user.destroy
      flash[:danger] = "削除しました！#{group_user_parameters}  #{params[:group_id]}"
    else
      flash[:danger] = "削除できませんでした#{group_user_parameters}"
    end
  end

  private
    def group_user_parameters
      params.permit(:group_id, :user_id)
    end
end
