import { CameraFeed } from "@/components/surveillance/camera-feed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Map, LayoutGrid } from "lucide-react"

export default function SurveillancePage() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Surveillance Ops</h1>
                    <p className="text-muted-foreground">Live monitoring of city sectors and active units.</p>
                </div>
            </div>

            <Tabs defaultValue="feeds" className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <TabsList>
                        <TabsTrigger value="feeds">
                            <LayoutGrid className="w-4 h-4 mr-2" />
                            Live Feeds
                        </TabsTrigger>
                        <TabsTrigger value="map">
                            <Map className="w-4 h-4 mr-2" />
                            Unit Map
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="feeds" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <CameraFeed
                            id="CAM-01"
                            name="Sector 7 - North Gate"
                            location="123 Main St"
                            status="LIVE"
                            imageUrl="https://images.unsplash.com/photo-1574359736952-475a896d863f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                        />
                        <CameraFeed
                            id="CAM-02"
                            name="Downtown Plaza"
                            location="Central Square"
                            status="LIVE"
                            imageUrl="https://images.unsplash.com/photo-1588698944583-04bc74d0e82c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                        />
                        <CameraFeed
                            id="CAM-03"
                            name="Subway Station 4"
                            location="W 4th St"
                            status="RECORDING"
                            imageUrl="https://images.unsplash.com/photo-1542456073-63162b24d776?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                        />
                        <CameraFeed
                            id="CAM-04"
                            name="Harbor Warehouse"
                            location="Dock 42"
                            status="OFFLINE"
                        />
                        <CameraFeed
                            id="CAM-05"
                            name="Traffic Junction A"
                            location="5th & Broadway"
                            status="LIVE"
                            imageUrl="https://images.unsplash.com/photo-1494587429621-3ce1a51203eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="map">
                    <Card className="h-[600px] w-full flex items-center justify-center bg-muted/20">
                        <CardContent className="flex flex-col items-center text-muted-foreground">
                            <Map className="h-16 w-16 mb-4 opacity-50" />
                            <p>Interactive Unit Map Placeholder</p>
                            <p className="text-xs">Integration with Leaflet/Mapbox required.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
