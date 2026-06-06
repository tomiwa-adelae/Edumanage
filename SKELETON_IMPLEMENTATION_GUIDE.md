# Skeleton Loading Implementation Guide

## ✅ Completed Pages (18 pages)

### Admin Section
1. ✅ [a/dashboard/page.tsx](app/(app)/(admin)/a/dashboard/page.tsx) - DashboardSkeleton
2. ✅ [a/staffs/page.tsx](app/(app)/(admin)/a/staffs/page.tsx) - CardsSkeleton + TableSkeleton
3. ✅ [a/teachers/page.tsx](app/(app)/(admin)/a/teachers/page.tsx) - CardsSkeleton + TableSkeleton
4. ✅ [a/students/page.tsx](app/(app)/(admin)/a/students/page.tsx) - CardsSkeleton + TableSkeleton
5. ✅ [a/roles/page.tsx](app/(app)/(admin)/a/roles/page.tsx) - CardsSkeleton + TableSkeleton
6. ✅ [a/school/page.tsx](app/(app)/(admin)/a/school/page.tsx) - CardsSkeleton + FormSkeleton
7. ✅ [a/classes/page.tsx](app/(app)/(admin)/a/classes/page.tsx) - CardsSkeleton + Grid Skeletons
8. ✅ [a/classes/new/page.tsx](app/(app)/(admin)/a/classes/new/page.tsx) - FormSkeleton
9. ✅ [a/classes/[id]/page.tsx](app/(app)/(admin)/a/classes/[id]/page.tsx) - DetailsSkeleton
10. ✅ [a/subjects/page.tsx](app/(app)/(admin)/a/subjects/page.tsx) - CardsSkeleton + Tabs Skeleton
11. ✅ [a/subjects/new/page.tsx](app/(app)/(admin)/a/subjects/new/page.tsx) - FormSkeleton
12. ✅ [a/staffs/new/page.tsx](app/(app)/(admin)/a/staffs/new/page.tsx) - FormSkeleton (2 columns)
13. ✅ [a/staffs/[username]/page.tsx](app/(app)/(admin)/a/staffs/[username]/page.tsx) - DetailsSkeleton
14. ✅ [a/staffs/[username]/edit/page.tsx](app/(app)/(admin)/a/staffs/[username]/edit/page.tsx) - FormSkeleton
15. ✅ [a/teachers/new/page.tsx](app/(app)/(admin)/a/teachers/new/page.tsx) - FormSkeleton
16. ✅ [a/students/new/page.tsx](app/(app)/(admin)/a/students/new/page.tsx) - FormSkeleton (2 columns)
17. ✅ [a/students/approval/page.tsx](app/(app)/(admin)/a/students/approval/page.tsx) - CardsSkeleton + ListSkeleton
18. ✅ [a/students/approval/[username]/page.tsx](app/(app)/(admin)/a/students/approval/[username]/page.tsx) - DetailsSkeleton

### Teacher Section
1. ✅ [t/dashboard/page.tsx](app/(app)/(teacher)/t/dashboard/page.tsx) - DashboardSkeleton

## 📋 Remaining Pages (43 pages)

### Admin Pages (8 remaining)
- [ ] a/assessment/page.tsx - Static page (no loading needed)
- [ ] a/timetables/page.tsx
- [ ] a/fees/page.tsx
- [ ] a/reports/page.tsx
- [ ] a/import/page.tsx
- [ ] a/settings/page.tsx
- [ ] a/students/[username]/page.tsx
- [ ] a/students/[username]/edit/page.tsx

### Teacher Pages (6 remaining)
- [ ] t/assignments/page.tsx
- [ ] t/assignments/new/page.tsx
- [ ] t/assignments/[slug]/page.tsx
- [ ] t/assignments/[slug]/[id]/page.tsx
- [ ] t/attendances/page.tsx
- [ ] t/settings/page.tsx

### Student Pages (7 remaining)
- [ ] s/dashboard/page.tsx (COMPLEX - two layouts)
- [ ] s/assignments/page.tsx
- [ ] s/assignments/[slug]/page.tsx
- [ ] s/notes/page.tsx
- [ ] s/notes/[slug]/page.tsx
- [ ] s/grades/page.tsx
- [ ] s/timetables/page.tsx
- [ ] s/settings/page.tsx

### Other Role Dashboards (6 pages)
- [ ] p/dashboard/page.tsx (Parent)
- [ ] p/children/page.tsx
- [ ] b/dashboard/page.tsx (Bursar)
- [ ] da/dashboard/page.tsx (Data Analyst)
- [ ] eo/dashboard/page.tsx (Exam Officer)
- [ ] l/dashboard/page.tsx (Librarian)
- [ ] it/dashboard/page.tsx (IT Support)

### Profile & Messages (4 pages)
- [ ] profile/page.tsx
- [ ] profile/[username]/page.tsx
- [ ] profile/[username]/edit/page.tsx
- [ ] messages/page.tsx

### Auth Pages (12 pages - optional)
- auth/page.tsx (login)
- auth/register/page.tsx
- auth/forgot-password/page.tsx
- auth/verify-code/page.tsx
- auth/new-password/page.tsx
- auth/new-password/success/page.tsx
- onboarding/student/page.tsx
- onboarding/staff/page.tsx
- school/calendar/page.tsx

## 🎨 Skeleton Components Reference

### 1. CardsSkeleton
**Use for**: Stat/metric cards at top of pages
```typescript
import { CardsSkeleton } from "@/components/CardsSkeleton";

{loading ? (
  <CardsSkeleton count={4} />
) : (
  <StatsCards ... />
)}
```

### 2. TableSkeleton
**Use for**: Data tables with rows and columns
```typescript
import { TableSkeleton } from "@/components/TableSkeleton";

{loading ? (
  <TableSkeleton columns={7} rows={10} />
) : (
  <DataTable ... />
)}
```

### 3. FormSkeleton
**Use for**: Form pages (new/edit/settings)
```typescript
import { FormSkeleton } from "@/components/FormSkeleton";

{loading ? (
  <FormSkeleton fields={8} columns={2} showHeader={true} />
) : (
  <Form ... />
)}
```

### 4. DetailsSkeleton
**Use for**: Detail/profile pages
```typescript
import { DetailsSkeleton } from "@/components/DetailsSkeleton";

{loading ? (
  <DetailsSkeleton sections={3} showAvatar={true} />
) : (
  <UserDetails ... />
)}
```

### 5. DashboardSkeleton
**Use for**: Dashboard pages with charts/stats/activity
```typescript
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

{loading ? (
  <DashboardSkeleton statCards={4} showChart={true} showRecentActivity={true} />
) : (
  <DashboardContent ... />
)}
```

### 6. ListSkeleton
**Use for**: Simple list views
```typescript
import { ListSkeleton } from "@/components/ListSkeleton";

{loading ? (
  <ListSkeleton items={5} itemHeight="md" />
) : (
  <List ... />
)}
```

### 7. Skeleton (Basic)
**Use for**: Custom layouts
```typescript
import { Skeleton } from "@/components/ui/skeleton";

{loading ? (
  <div className="space-y-3">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-8 w-3/4" />
  </div>
) : (
  <CustomComponent ... />
)}
```

## 🔧 Implementation Patterns

### Pattern 1: Simple Page (List/Table)
```typescript
// Before
if (loading) return <Loader />;

// After
return (
  <div className="space-y-6">
    <PageHeader ... />

    {loading ? (
      <CardsSkeleton count={3} />
    ) : (
      <StatsCards ... />
    )}

    {loading ? (
      <TableSkeleton columns={7} rows={10} />
    ) : (
      <DataTable ... />
    )}
  </div>
);
```

### Pattern 2: Form Page
```typescript
// Before
if (loading) return <Loader />;

// After
return (
  <div className="space-y-6">
    <PageHeader ... />

    {loading ? (
      <FormSkeleton fields={10} columns={2} />
    ) : (
      <Form ... />
    )}
  </div>
);
```

### Pattern 3: Detail Page
```typescript
// Before
if (loading) return <Loader />;

// After
return (
  <div className="space-y-6">
    <PageHeader ... />

    {loading ? (
      <DetailsSkeleton sections={4} showAvatar={true} />
    ) : (
      <>
        <ProfileHeader ... />
        <InfoSections ... />
      </>
    )}
  </div>
);
```

### Pattern 4: Dashboard Page
```typescript
// Before
if (loading) return <Loader />;

// After
return (
  <div className="space-y-6">
    <PageHeader ... />

    {loading ? (
      <DashboardSkeleton statCards={4} showChart={true} />
    ) : (
      <>
        <StatsCards ... />
        <Charts ... />
        <RecentActivity ... />
      </>
    )}
  </div>
);
```

### Pattern 5: Complex Page with Multiple Sections
```typescript
return (
  <div className="space-y-6">
    <PageHeader ... />

    {loading ? (
      <CardsSkeleton count={4} />
    ) : (
      <StatsCards ... />
    )}

    <SearchBar ... /> {/* Always visible */}

    {loading ? (
      <TableSkeleton columns={7} rows={10} />
    ) : (
      <DataTable ... />
    )}

    {!loading && meta && meta.total > 0 && (
      <Pagination ... />
    )}
  </div>
);
```

## ⚡ Quick Implementation Steps

1. **Identify page type** (dashboard, list, form, detail)
2. **Add imports**:
   ```typescript
   import { CardsSkeleton } from "@/components/CardsSkeleton";
   import { TableSkeleton } from "@/components/TableSkeleton";
   // ... other skeleton imports as needed
   ```
3. **Remove**: `import { Loader } from "@/components/Loader";`
4. **Find**: `if (loading) return <Loader />;`
5. **Replace** with inline conditional rendering
6. **Keep visible**: PageHeader, SearchBar, static elements
7. **Wrap in loading check**: Cards, Tables, Forms, Charts

## 📊 Progress Tracking

- **Total Pages**: 61
- **Completed**: 19 (31%)
- **Remaining**: 42 (69%)

### By Section:
- Admin: 11/19 (58%) ✅
- Teacher: 1/7 (14%) 🟡
- Student: 0/8 (0%) 🔴
- Other Roles: 0/6 (0%) 🔴
- Profile/Messages: 0/4 (0%) 🔴
- Auth/Onboarding: 0/12 (0%) 🔴

## 🎯 Priority Order

1. **High Priority** (User-facing main pages):
   - Student dashboard
   - Teacher assignments
   - Profile pages
   - Messages

2. **Medium Priority** (Frequently used):
   - Other role dashboards
   - Settings pages
   - Timetables

3. **Low Priority** (Less frequent):
   - Import/Reports
   - Auth pages (quick operations)

## 💡 Tips

- PageHeaders should **always** be visible
- SearchBars should **always** be visible
- Use `!loading &&` for conditional elements like pagination
- Match skeleton structure to actual content
- Test on slow network to see skeleton effectiveness
- Keep skeleton simple - don't over-engineer
