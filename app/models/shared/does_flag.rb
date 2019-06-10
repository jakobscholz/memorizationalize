module Shared::DoesFlag
  as_trait do |field, default: nil, virtual: false|

    field_var = "@#{field}"
    set_field = "#{field}="
    field_query = "#{field}?"

    validates field.to_sym, inclusion: { in: [true, false] }, allow_nil: !!virtual

    unless default.nil?
      has_defaults field.to_sym => default
    end

    if virtual
      attr_reader field

      define_method field_query do
        send(field)
      end

      define_method set_field do |value|
        value = ActiveRecord::ConnectionAdapters::Column.value_to_boolean(value)
        instance_variable_set(field_var, value)
      end
    end

  end
end
