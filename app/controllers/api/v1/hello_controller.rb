class Api::V1::HelloController < ApplicationController
  def index
    @data = { greeting: User.find_by(id: 1).id }
  end

  def name
    @data = { greeting: User.find_by(id: 1).name }
  end
end
