class GroupsController < ApplicationController
  def new
    @group = Group.new
  end

  def create
    @group = Group.new(group_parameters)
    @group.group_users.build(group_user_parameters)
    if @group.save
      flash[:danger] = @group.name + "を作成しました！"
      redirect_to current_user
    else
      flash[:danger] = @group.errors.full_messages + @group_user.errors.full_messages
      @group.destroy
      @group_user.destroy
      redirect_to current_user
    end
  end

  def edit
    @group = Group.find_by(id: params[:id])
  end

  def show
    @group = Group.find_by(id: params[:id])
  end

  def update
    @group = Group.find_by(id: params[:id])
    if @group.update(group_update_parameters)
      flash[:danger]="グループ名を変更しました．"
      redirect_to current_user
    else
      flash[:danger]= @group.errors.full_messages
      redirect_to edit_group_path(@group)
    end
  end


  def destroy
    @group = Group.find_by(id: params[:id])
    if @group.destroy
      flash[:danger]="グループを削除しました．"
      redirect_to current_user
    else
      flash[:danger]= @group.errors.full_messages
      redirect_to edit_group_path(@group)
    end
  end

  private
    def group_parameters
      params.require(:group).permit(:name, {user_ids: []})
    end

    def group_update_parameters
      params.require(:group).permit(:name)
    end

    def group_user_parameters
      p = {group_id: @group.id, user_id: current_user.id}
    end



end
