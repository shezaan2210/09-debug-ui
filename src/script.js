import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

const gui = new GUI({
    title: 'Debug Panel'
});
gui.close()
const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
debugObject.color = '#00d5ff'
/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const tweaks = gui.addFolder('change').close()
tweaks.add(mesh.position, 'x').min(-2).max(2).step(.01).name('X-Axis')
tweaks.add(mesh.position, 'y').min(-2).max(2).step(.01).name('Y-Axis')
tweaks.add(mesh.position, 'z').min(-2).max(2).step(.01).name('Z-Axis')

tweaks.add(material, 'wireframe')
tweaks.add(mesh, 'visible')

tweaks.addColor(debugObject, 'color').onChange(()=>{
  let x = material.color.set(debugObject.color)
  console.log(x.r, x.g, x.b)
})

debugObject.spin = ()=>{
gsap.to(mesh.rotation, {duration: 1, x: mesh.rotation.x + Math.PI * 2 })
gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + Math.PI * 2 })
gsap.to(mesh.rotation, {duration: 1, z: mesh.rotation.z + Math.PI * 2 })
}
tweaks.add(debugObject, 'spin')

debugObject.subDivision = 2
tweaks.add(debugObject, 'subDivision').min(1).max(20).step(1).name('subDivision').onFinishChange(()=>{
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subDivision, debugObject.subDivision, debugObject.subDivision)
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()