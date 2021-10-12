class IconImageController < ApplicationController
  def upload
    filename = params[:filename]
    filetype = params[:filetype]

    post = S3_BUCKET.presigned_post(
      key: "upload_video/#{filename}",
      acl: 'public-read',
      content_type: filetype,
      metadata: {
        'original-filename' => filename
      }
    )
    render json: {url: post.url,fields: post.fields}
  end
end
