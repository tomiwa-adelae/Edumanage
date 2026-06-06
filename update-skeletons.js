const fs = require('fs');
const path = require('path');

// File configurations: path -> [skeleton type, skeleton props]
const fileConfigurations = {
  // Student pages - Admin
  'app/(app)/(admin)/a/students/approval/page.tsx': {
    import: "import { CardsSkeleton } from '@/components/CardsSkeleton';\nimport { ListSkeleton } from '@/components/ListSkeleton';",
    remove: "import { Loader } from '@/components/Loader';",
    replacement: {
      from: /if \(loading\) return <Loader \/>;/,
      to: `return (
    <div className="space-y-6">
      <PageHeader
        title={"Student Approvals"}
        description={"Review and approve student enrollment requests"}
      />
      {loading ? (
        <>
          <CardsSkeleton count={2} />
          <ListSkeleton items={5} showHeader={false} itemHeight="h-32" />
        </>
      ) : (
        <>
          <StudentApprovalCards
            students={students.length}
            rejectedStudents={rejectedStudents.length}
          />
          <StudentSearchComponent />
          <div className="space-y-4">
            {allStudents.length === 0 && <NothingFound message="No students yet" />}
            {allStudents.map((student) => (
              <ApprovalStudentBox
                key={student?.id}
                student={student}
                onStudentStatusChange={handleStudentStatusChange}
                classes={classes}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );`
    }
  },
  'app/(app)/(admin)/a/students/approval/[username]/page.tsx': {
    import: "import { DetailsSkeleton } from '@/components/DetailsSkeleton';",
    remove: "import { Loader } from '@/components/Loader';",
    replacement: {
      from: /if \(loading\) return <Loader \/>;/,
      to: `if (loading) return (
    <div className="space-y-6">
      <PageHeader
        title="Student Details"
        description="Loading student information..."
        back
      />
      <DetailsSkeleton sections={6} showAvatar={true} />
    </div>
  );`
    }
  },
  'app/(app)/(admin)/a/students/[username]/page.tsx': {
    import: "import { DetailsSkeleton } from '@/components/DetailsSkeleton';",
    remove: "import { Loader } from '@/components/Loader';",
    replacement: {
      from: /if \(loading\) return <Loader \/>;/,
      to: `if (loading) return (
    <div className="space-y-6">
      <PageHeader
        title="Student Details"
        description="Loading student information..."
        back
      />
      <DetailsSkeleton sections={8} showAvatar={true} />
    </div>
  );`
    }
  },
  'app/(app)/(admin)/a/students/[username]/edit/page.tsx': {
    import: "import { FormSkeleton } from '@/components/FormSkeleton';",
    remove: "import { Loader } from '@/components/Loader';",
    replacement: {
      from: /if \(loading\) return <Loader \/>;/,
      to: `if (loading) return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Student Details"
        description="Loading student information..."
        back
      />
      <FormSkeleton fields={12} showHeader={false} columns={2} />
    </div>
  );`
    }
  },
};

// Process each file
Object.entries(fileConfigurations).forEach(([filePath, config]) => {
  const fullPath = path.join(__dirname, filePath);

  try {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Remove old import
    if (config.remove) {
      content = content.replace(new RegExp(config.remove.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), config.import);
    }

    // Apply replacement
    if (config.replacement) {
      content = content.replace(config.replacement.from, config.replacement.to);
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
  }
});

console.log('\nSkeleton updates complete!');
