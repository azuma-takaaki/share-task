class TasksController < ApplicationController
  def new
    @task = Task.new
    @group = Group.find_by(id: params[:group_id])
  end

  def create
    @group = Group.find_by(id: params[:task][:group_id])
    @task = @group.tasks.build(strong_parameters)

    if @task.save
      redirect_to @group
    else
      redirect_to User.find_by(id: sessions[:user_id])
    end
  end

  def show
    @task = Task.find_by(id: params[:id])
  end

  def edit
    @task = Task.find_by(id: params[:id])
  end

  def update
    @task = Task.find_by(id: params[:id])
    if @task.update(strong_parameters)
      redirect_to @task.group
   else
     redirect_to task_path(@task)
   end
  end

  def destroy
    @task = Task.find_by(id: params[:id])
    if @task.destroy
      flash[:danger] = 'タスクを削除しました'
      redirect_to current_user
   else
     flash[:danger] = @task.errors.full_messages
     redirect_to task_path(@task)
   end
 end

  private
    def strong_parameters
      params.require(:task).permit(:content)
    end

end
