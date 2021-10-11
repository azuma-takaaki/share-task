unless Rails.env.development? || Rails.env.test?
  CarrierWave.configure do |config|
    config.fog_credentials = {
      provider: 'AWS',
      aws_access_key_id: 'AKIAVMDUX3BVC5U5V7XY',
      aws_secret_access_key: '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',
      region: 'us-east-2'
    }

    config.fog_directory  = 'tumiagejou-image'
    config.cache_storage = :fog
  end
end
