require 'open-uri'
class TweetsController < ApplicationController
  def create
    @twitter_account_token = TwitterToken.find_by(user_id: current_user().id, account_name: params[:tweet][:account_name])
    @twitter = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['CONSUMER_KEY']
      config.consumer_secret     = ENV['CONSUMER_SECRET_KEY']
      config.access_token        = @twitter_account_token.token
      config.access_token_secret = @twitter_account_token.secret_token
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
      @new_twitter_token = TwitterToken.new(user_id: current_user().id,
                                            token: omniauth.credentials.token,
                                            secret_token: omniauth.credentials.secret,
                                            account_name: omniauth.info.name
                                           )

      if @new_twitter_token.save
        redirect_to "/"
      else
        redirect_to "/"
      end
    else
      redirect_to "/"
    end
  end
end
