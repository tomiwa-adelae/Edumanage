# UX Improvements & Caching Strategy

## ✅ Completed Improvements

### 1. Skeleton Loading States
Replaced full-page `<Loader />` with intelligent skeleton components:

- **CardsSkeleton** - For stat cards at the top of pages
- **TableSkeleton** - For data tables with configurable columns and rows

#### Benefits:
- Static parts of the page (PageHeader, SearchBar, navigation) remain visible during data fetches
- Users see the page structure immediately
- Reduced perceived loading time
- Better visual feedback

#### Updated Pages:
- ✅ [Staffs Page](app/(app)/(admin)/a/staffs/page.tsx)
- ✅ [Teachers Page](app/(app)/(admin)/a/teachers/page.tsx)
- ✅ [Students Page](app/(app)/(admin)/a/students/page.tsx)
- ✅ [Roles Page](app/(app)/(admin)/a/roles/page.tsx)

### 2. Improved Search & Pagination
- Fixed search bar conflicts with pagination
- Debounced search (500ms) to reduce API calls
- URL-based state management for shareable links
- Smooth navigation without full page reloads

## 🚀 Recommended Next Steps

### 1. Implement React Query for Advanced Caching

React Query provides:
- Automatic background refetching
- Cache invalidation strategies
- Optimistic updates
- Reduced network requests

**Installation:**
```bash
npm install @tanstack/react-query
```

**Setup Provider** (app/layout.tsx):
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Example Usage** (staffs/page.tsx):
```typescript
import { useQuery } from '@tanstack/react-query';

const { data: staffsData, isLoading, error } = useQuery({
  queryKey: ['staffs', user?.schoolId, currentPage, limit, search],
  queryFn: () => schoolService.getSchoolStaffs(user.schoolId, {
    page: currentPage,
    limit,
    search: search || undefined,
  }),
  enabled: !!user?.schoolId,
  staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
});
```

### 2. Backend Caching with Redis

Add Redis caching to frequently accessed endpoints:

**Installation:**
```bash
npm install @nestjs/cache-manager cache-manager
npm install cache-manager-redis-store
```

**Setup** (app.module.ts):
```typescript
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      ttl: 300, // 5 minutes default
    }),
  ],
})
```

**Usage** (school.controller.ts):
```typescript
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('schools')
@UseInterceptors(CacheInterceptor)
export class SchoolController {

  @Get(':schoolId/staffs')
  @CacheTTL(300) // Cache for 5 minutes
  async getSchoolStaffs(
    @Param('schoolId') schoolId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.schoolService.getSchoolStaffs(schoolId, paginationDto);
  }
}
```

### 3. Implement Incremental Static Regeneration (ISR)

For less frequently changing data (like school info, job roles):

```typescript
// app/(app)/(admin)/a/school/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function SchoolPage() {
  // Server component that fetches data
  const schoolData = await fetch('...', { next: { revalidate: 3600 } });
  return <SchoolInfo data={schoolData} />;
}
```

### 4. Optimize Data Fetching

**Current Pattern (Multiple Requests):**
```typescript
const [staffsResponse, teachersResponse] = await Promise.all([
  schoolService.getSchoolStaffs(...),
  schoolService.getSchoolTeachers(...),
]);
```

**Recommended: Single Endpoint**
Create a combined endpoint that returns all dashboard data:

```typescript
// Backend
@Get(':schoolId/dashboard-data')
async getDashboardData(@Param('schoolId') schoolId: string) {
  return {
    staffs: await this.getSchoolStaffs(schoolId),
    teachers: await this.getSchoolTeachers(schoolId),
    students: await this.getStudents(schoolId),
    stats: await this.getStats(schoolId),
  };
}

// Frontend
const dashboardData = await schoolService.getDashboardData(schoolId);
```

### 5. Database Indexing

Ensure proper indexes for pagination and search:

```sql
-- Add indexes for common query patterns
CREATE INDEX idx_user_school_id ON "User"("schoolId");
CREATE INDEX idx_user_email ON "User"("email");
CREATE INDEX idx_user_deleted_at ON "User"("deletedAt");
CREATE INDEX idx_user_role ON "User"("role");

-- Composite index for search + pagination
CREATE INDEX idx_user_search ON "User"("schoolId", "firstName", "lastName", "email");
```

### 6. Implement Virtual Scrolling

For very long lists (500+ items), use virtual scrolling:

**Installation:**
```bash
npm install @tanstack/react-virtual
```

**Usage:**
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: students.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 60,
});
```

### 7. Add Loading Placeholders for Images

```typescript
<Image
  src={user.avatar}
  alt={user.name}
  placeholder="blur"
  blurDataURL="data:image/png;base64,..."
/>
```

### 8. Prefetch Data on Hover

```typescript
const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ['staff-details', staffId],
    queryFn: () => staffService.getStaffDetails(staffId),
  });
};

<Link onMouseEnter={handleMouseEnter} href={`/staffs/${staffId}`}>
  View Details
</Link>
```

## 📊 Expected Performance Gains

| Improvement | Impact | Complexity |
|-------------|--------|------------|
| Skeleton Loaders | ✅ Immediate (Completed) | Low |
| React Query | 60% fewer API calls | Medium |
| Redis Caching | 80% faster repeated queries | Medium |
| Database Indexes | 90% faster search queries | Low |
| Virtual Scrolling | Handles 10,000+ items smoothly | High |
| ISR | Near-instant page loads | Low |

## 🎯 Priority Implementation Order

1. **High Priority (This Week)**
   - ✅ Skeleton loaders (DONE)
   - Database indexes
   - React Query setup

2. **Medium Priority (Next Week)**
   - Redis caching
   - Combined API endpoints
   - Prefetching on hover

3. **Low Priority (Future)**
   - Virtual scrolling (only if needed)
   - ISR for static pages
   - Image optimization

## 📈 Monitoring

Track these metrics:
- Time to First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Cache hit rate
- API response times
- Database query performance

**Tools:**
- Vercel Analytics
- React Query Devtools
- Redis monitoring dashboard
