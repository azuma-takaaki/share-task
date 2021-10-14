class IconImageController < ApplicationController
  def upload
    filename = params[:filename]
    filetype = params[:filetype]

    path = ""
    if Rails.env == 'production'
      path = "production"
    elsif Rails.env == 'development'
      path = "development"
    elsif Rails.env == 'test'
      path = "test"
    end

    @user = current_user()
    @user.update(icon: "icon_" + @user.id.to_s)
    if filename != "icon_0"
      filename = "icon_" + @user.id.to_s
    end

    post = S3_BUCKET.presigned_post(
      key: path + "_icon/#{filename}",
      acl: 'public-read',
      content_type: filetype,
      metadata: {
        'original-filename' => filename
      }
    )
    render json: {url: post.url,fields: post.fields}
  end
end
