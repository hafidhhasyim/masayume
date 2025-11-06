import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"
import { useEffect, useState } from "react"

interface OrgMember {
  id: number
  name: string
  position: string
  photoUrl: string | null
  parentId: number | null
  level: number
  children?: OrgMember[]
}

interface OrganizationChartProps {
  // Legacy support for text-based data
  data?: string
}

export function OrganizationChart({ data }: OrganizationChartProps) {
  const [orgTree, setOrgTree] = useState<OrgMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrganizationData()
  }, [])

  async function fetchOrganizationData() {
    try {
      const res = await fetch("/api/organization-members")
      const members: OrgMember[] = await res.json()
      
      // Build tree structure
      const tree = buildTree(members)
      setOrgTree(tree)
    } catch (error) {
      console.error("Error fetching organization data:", error)
    } finally {
      setLoading(false)
    }
  }

  function buildTree(members: OrgMember[]): OrgMember[] {
    const map = new Map<number, OrgMember>()
    const roots: OrgMember[] = []

    // Create a map of all members
    members.forEach((member) => {
      map.set(member.id, { ...member, children: [] })
    })

    // Build the tree
    members.forEach((member) => {
      const node = map.get(member.id)!
      if (member.parentId === null) {
        roots.push(node)
      } else {
        const parent = map.get(member.parentId)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(node)
        }
      }
    })

    return roots
  }

  const renderNode = (member: OrgMember, isLast: boolean = false) => (
    <div key={member.id} className="flex flex-col items-center">
      {/* Member Card */}
      <Card className="w-44 overflow-hidden hover:shadow-lg transition-all hover:scale-105 border-2">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center space-y-2">
            {/* Photo */}
            <div className="relative w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary/30">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            
            {/* Name and Position */}
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm leading-tight">{member.name}</h4>
              <p className="text-xs text-primary font-medium leading-tight">{member.position}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children */}
      {member.children && member.children.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          {/* Vertical Line from parent */}
          <div className="w-0.5 h-8 bg-border" />
          
          {/* Horizontal connector and children */}
          <div className="relative flex items-start gap-6">
            {/* Horizontal line connecting all children */}
            {member.children.length > 1 && (
              <div 
                className="absolute top-0 left-0 right-0 h-0.5 bg-border"
                style={{
                  width: `calc(100% - 48px)`,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              />
            )}
            
            {/* Render each child */}
            {member.children.map((child, idx) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Vertical line to child */}
                <div className="w-0.5 h-8 bg-border" />
                {renderNode(child, idx === member.children!.length - 1)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 w-44 bg-muted rounded-lg mx-auto" />
          <p className="text-muted-foreground">Memuat struktur organisasi...</p>
        </div>
      </div>
    )
  }

  if (orgTree.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Tidak ada data struktur organisasi
      </div>
    )
  }

  return (
    <div className="py-8 overflow-x-auto">
      <div className="inline-flex flex-col items-center min-w-full justify-center space-y-8">
        {orgTree.map((rootMember) => (
          <div key={rootMember.id}>
            {renderNode(rootMember)}
          </div>
        ))}
      </div>
    </div>
  )
}