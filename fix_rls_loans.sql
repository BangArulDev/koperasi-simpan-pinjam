-- Allow members to insert (request) new loans
-- This allows a user to insert a row into 'loans' ONLY IF the 'member_id' matches their own auth UID.

drop policy if exists "Members can request loans." on loans;

create policy "Members can request loans." 
  on loans for insert 
  with check ( auth.uid() = member_id );
