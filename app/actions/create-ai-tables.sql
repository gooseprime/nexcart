-- Create AI conversations table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  messages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user searches table
CREATE TABLE IF NOT EXISTS public.user_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  query TEXT NOT NULL,
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_searches ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own AI conversations
CREATE POLICY "Users can view their own AI conversations"
  ON public.ai_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own AI conversations
CREATE POLICY "Users can insert their own AI conversations"
  ON public.ai_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to view their own searches
CREATE POLICY "Users can view their own searches"
  ON public.user_searches
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own searches
CREATE POLICY "Users can insert their own searches"
  ON public.user_searches
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
