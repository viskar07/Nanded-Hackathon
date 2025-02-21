'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { Briefcase, Building2, Calendar, FileText, GraduationCap, MapPin, Users, Vote } from 'lucide-react'
import Link from "next/link"

interface Institution {
    id: string | null;
    name: string | null;
    jsonDescription: string | null;
    htmlDescription: string | null;
    icon: string | null;
    clerkOrganizationId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    isActive: boolean | null;
    creatorId: string | null;
    departments: { id: string; name: string }[] | null;
    organizations: { id: string; name: string }[] | null;
    students: { id: string; name: string }[] | null;
    faculty: { id: string; name: string }[] | null;
    facility: { id: string; name: string }[] | null;
    election: { id: string; name: string }[] | null;
  }
  

export default function InstitutionCard({ institution }: { institution: Institution }) {
  if (!institution) {
    return <p>Institution data is not available.</p>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {institution.icon && (
              <img src={institution.icon || "/placeholder.svg"} alt={`${institution.name} icon`} className="w-12 h-12 rounded-full" />
            )}
            <div>
              {institution.name && <CardTitle>{institution.name}</CardTitle>}
              {institution.id && <CardDescription>ID: {institution.id}</CardDescription>}
            </div>
          </div>
          <Badge variant={institution.isActive ? "default" : "secondary"}>
            {institution.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {(institution.createdAt || institution.updatedAt) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institution.createdAt && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>Created: {format(new Date(institution.createdAt), 'PPP')}</span>
              </div>
            )}
            {institution.updatedAt && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>Updated: {format(new Date(institution.updatedAt), 'PPP')}</span>
              </div>
            )}
          </div>
        )}

        {institution.jsonDescription && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">JSON Description</h3>
            <pre className="bg-muted p-2 rounded-md overflow-x-auto">
              {institution.jsonDescription}
            </pre>
          </div>
        )}

        {institution.htmlDescription && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">HTML Description</h3>
            <div className="bg-muted p-2 rounded-md overflow-x-auto" dangerouslySetInnerHTML={{ __html: institution.htmlDescription }} />
          </div>
        )}

        <Accordion type="single" collapsible className="w-full">
          {institution.departments && institution.departments.length > 0 && (
            <AccordionItem value="departments">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Departments ({institution.departments.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside">
                  {institution.departments.map(dept => (
                    <li key={dept.id}>{dept.name}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {institution.organizations && institution.organizations.length > 0 && (
            <AccordionItem value="organizations">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Organizations ({institution.organizations.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside">
                  {institution.organizations.map(org => (
                    <li key={org.id}>{org.name}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {institution.students && institution.students.length > 0 && (
            <AccordionItem value="students">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Students ({institution.students.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside">
                  {institution.students.map(student => (
                    <li key={student.id}>{student.name}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {institution.faculty && institution.faculty.length > 0 && (
            <AccordionItem value="faculty">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Faculty ({institution.faculty.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside">
                  {institution.faculty.map(member => (
                    <li key={member.id}>{member.name}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {institution.facility && institution.facility.length > 0 && (
            <AccordionItem value="facility">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Facilities ({institution.facility.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside">
                  {institution.facility.map(fac => (
                    <li key={fac.id}>{fac.name}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {institution.election && institution.election.length > 0 && (
            <AccordionItem value="elections">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <Vote className="w-5 h-5" />
                  <span>Elections ({institution.election.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside">
                  {institution.election.map(elec => (
                    <li key={elec.id}>{elec.name}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={institution.isActive!}
              id="active-status"
            />
            <label htmlFor="active-status">Active Status</label>
          </div>
          <Link href={`/institutions/${institution.clerkOrganizationId}/dashboard/${institution.creatorId}`}>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            View Institute
          </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
