class TasksController < ApplicationController
  def new
    @task = Task.new
  end

  def create

    @task = Task.new(strong_parameters)
    if @task.save
      redirect_to @task
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
      redirect_to current_user
   else
     redirect_to task_path(@task)
   end
  end

  private
    def strong_parameters
      params.require(:task).permit(:content)
    end

end
