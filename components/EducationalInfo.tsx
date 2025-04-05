import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EducationalInfo() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Electric Field Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Electric Field Lines</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Electric field lines are a visual representation of the electric field in space. They:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300">
            <li>Start from positive charges and end at negative charges</li>
            <li>Point in the direction of the force on a positive test charge</li>
            <li>Have a density proportional to the field strength</li>
            <li>Never cross each other</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium">Equipotential Lines</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Equipotential lines connect points of equal electric potential. They:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300">
            <li>Are always perpendicular to electric field lines</li>
            <li>Require no work to move a charge along them</li>
            <li>Are closer together where the electric field is stronger</li>
            <li>Form closed loops or extend to infinity</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium">Parallel Charged Plates</h3>
          <p className="text-gray-700 dark:text-gray-300">For two parallel charged plates (or bars):</p>
          <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300">
            <li>The electric field is approximately uniform between the plates</li>
            <li>Field strength decreases as the separation increases</li>
            <li>Equipotential surfaces are parallel to the plates and equally spaced in a uniform field</li>
            <li>The potential difference between the plates is directly proportional to their separation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

