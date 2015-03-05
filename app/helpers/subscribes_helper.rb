module SubscribesHelper
	def generate_token
		Digest::SHA1.hexdigest([Time.now, rand].join)
	end
end
