-- Set the working directory context
\cd :working_directory

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount BIGINT,
  currency TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Add trigger for updating the updated_at column
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index on customer_id for faster lookups
CREATE INDEX idx_payments_customer_id ON payments(customer_id);

-- Create index on stripe_payment_intent_id for faster lookups
CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- Reset the working directory
\cd :previous_working_directory