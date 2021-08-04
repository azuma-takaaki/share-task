class GroupsController < ApplicationController
  def new
    @group = Group.new
  end

  def index
    @groups = Group.all
    render :json => [@groups]
  end

  def create
    @group = Group.new(group_parameters)
    @group.group_users.build(group_user_parameters)
    if @group.save
      #flash[:danger] = @group.name + "を作成しました！"
      render :json => ['succeeded in creating a group']
    else
      error_messages = @group.errors.full_messages
      replace_index_number = error_messages.index('グループ名はすでに存在します')

      if replace_index_number then
        error_messages[replace_index_number] = 'その名前のグループは既に存在します'
      end
      logger.debug(replace_index_number)
      render :json => ['failed to create a group', error_messages]
    end
  end

  def edit
    if !group_member?
      flash[:danger] = "その操作は実行できません#{params}"
      redirect_to current_user
    end
    @group = Group.find_by(id: params[:id])
  end

  def show
    if !group_member?
      flash[:danger] = "その操作は実行できません#{params}"
      redirect_to current_user
    end
    #@group = Group.find_by(id: params[:id])
    group = Group.find_by(id: params[:id])
    render :json => [group.users, group.tasks]
  end




  def update
    if !group_member?
      flash[:danger] = "その操作は実行できません#{params}"
      redirect_to current_user
    end
    @group = Group.find_by(id: params[:id])
    if @group.update(group_update_parameters)
      #flash[:danger]="グループ名を変更しました．"
      render :json => [@group]
    else
      flash[:danger]= @group.errors.full_messages
      redirect_to edit_group_path(@group)
    end
  end


  def destroy
    if !group_member?
      flash[:danger] = "その操作は実行できません#{params}"
    end
    @group = Group.find_by(id: params[:id])
    if @group.destroy
    else
      flash[:danger]= @group.errors.full_messages
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

    def group_member?
      GroupUser.exists?(group_id: params[:id], user_id: current_user.id)
    end



end
