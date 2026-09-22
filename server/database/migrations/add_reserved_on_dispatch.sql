-- Add reserved_on_dispatch to stock_transfers for backward compatibility
-- When true: dispatch reserved stock, receive releases + deducts
-- When false/null: old flow - dispatch already deducted, receive only adds to dest

ALTER TABLE public.stock_transfers 
ADD COLUMN IF NOT EXISTS reserved_on_dispatch BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.stock_transfers.reserved_on_dispatch IS 
'True if dispatch used reserve (new flow). False/null = old flow (deducted on dispatch).';
