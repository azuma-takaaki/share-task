require 'open-uri'
class TweetsController < ApplicationController
  def create
    @twitter = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['CONSUMER_KEY']
      config.consumer_secret     = ENV['CONSUMER_SECRET_KEY']
      config.access_token        = ENV['ACCESS_TOKEN']
      config.access_token_secret = ENV['ACCESS_TOKEN_SECRET']
    end
    data_url = params[:tweet][:image]
    png      = Base64.decode64(data_url['data:image/png;base64,'.length .. -1])
    File.open('app/assets/images/tweet.png', 'wb') { |f| f.write(png) }

    text = params[:tweet][:text]
    begin
      @twitter.update_with_media(text, 'app/assets/images/tweet.png')
      #@twitter.update(text)
      render :json => ["Successful tweet"]
    rescue Twitter::Error::ClientError => client_error
      logger.debug(client_error)
      render :json => ["Tweet failed", client_error]
    end
    #if @twitter.update(text)
    #  render :json => ["Successful tweet"]
    #else
    #  render :json => ["Tweet failed"]
    #end
  end

  def callback
    omniauth = request.env['omniauth.auth']
    if omniauth
      omniauth.credentials.token
      omniauth.credentials.secret
      redirect_to "/"
    else
      redirect_to "/"
    end
  end
end
