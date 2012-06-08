module AuthenticationsHelper
	def resource_name
	  :admin
	end

	def resource
	  @resource ||= Admin.new
	end
	def devise_mapping
	  @devise_mapping ||= Devise.mappings[:admin]
	end
	def resource_class
		Admin
	end
end