-- Create Habit Logs Table
create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  completed_at date default CURRENT_DATE not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(habit_id, completed_at) -- Prevent duplicate logs for the same day
);

-- RLS Policies
alter table public.habit_logs enable row level security;

create policy "Users can view their own logs"
  on public.habit_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own logs"
  on public.habit_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own logs"
  on public.habit_logs for delete
  using (auth.uid() = user_id);
